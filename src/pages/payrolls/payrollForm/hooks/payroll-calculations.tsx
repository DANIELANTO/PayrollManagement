import { useMemo } from 'react';
import { useEmployeeStore } from '../../../../store/employee-store';
import { Employee, FormState } from '../../../../types';
import { PayrollService } from '../../services/payroll-service';

interface OvertimeCalculation {
  dailyOvertimePay: number;
  nightlyOvertimePay: number;
  totalOvertimePay: number;
}


// Constants for the calculation of the yearly bonus
const MINIMUM_WAGE = 365; // Minimum wage for the commerce sector 2024
const AGUINALDO_TAX_EXEMPT_LIMIT = MINIMUM_WAGE * 2; // Tax exemption limit for the yearly bonus

export const usePayrollCalculations = (formData: FormState) => {
  const employees = useEmployeeStore((state) => state.employees);
  
  return useMemo(() => {
    const selectedEmployee = employees.find(
      (emp: Employee) => emp.id === formData.selectedEmployee
    );

    const { totalBonus, taxableBonus } = formData.includeAguinaldo && selectedEmployee
      ? calculateYearlyBonus(
          (Number(formData.firstQuinzena)) + (Number(formData.secondQuinzena)),
          selectedEmployee.startDate
        )
      : { totalBonus: 0, taxableBonus: 0 };


    // Calculamos el salario bruto incluyendo todas las adiciones y restando descuentos
    const grossSalary =
      Number(formData.firstQuinzena) +
      Number(formData.secondQuinzena) +
      Number(formData.totalOvertimePay) +
      Number(formData.bonus) +
      Number(formData.vacation) -
      Number(formData.discount);

    // Employee deductions
    const isss = Math.min(30, grossSalary * 0.03); // Max $30
    const afp = grossSalary * 0.0725;

    // Calculate rent including taxable portion of aguinaldo
    const taxableIncome = calculateMonthlyTaxableIncome(
      grossSalary,
      taxableBonus,
      isss,
      afp
    );
    const rent = calculateISR(taxableIncome);

    const totalDeductions = isss + afp + rent;
    const netSalary = grossSalary + totalBonus - totalDeductions;

    // Employer contributions
    const employerIsss = grossSalary * 0.075;
    const employerAfp = grossSalary * 0.0875;
    const hasInsaforp = employees.length > 10;
    const insaforp = hasInsaforp ? grossSalary * 0.01 : 0;
    const totalEmployerContributions = employerIsss + employerAfp + insaforp;

    return {
      grossSalary: (grossSalary + totalBonus).toString(),
      isss: isss.toString(),
      afp: afp.toString(),
      rent: rent.toString(),
      totalDeductions: totalDeductions.toString(),
      netSalary: netSalary.toString(),
      employerIsss: employerIsss.toString(),
      employerAfp: employerAfp.toString(),
      insaforp: insaforp.toString(),
      totalEmployerContributions: totalEmployerContributions.toString(),
      aguinaldo: totalBonus.toString(),
      aguinaldoTaxable: taxableBonus.toString(),
    };
  }, [formData, employees]);
};

// Calculate monthly taxable income including aguinaldo's taxable portion
const calculateMonthlyTaxableIncome = (
  grossSalary: number,
  taxableBonus: number,
  isss: number,
  afp: number
): number => {
  // Add taxable portion of aguinaldo to regular taxable income
  return grossSalary - isss - afp + taxableBonus;
};


// Calculate overtime pay based on base salary

export const calculateOvertimePay = (
  dailyHours: number,
  nightlyHours: number,
  baseSalary: number
): OvertimeCalculation => {
  // Calcular la tarifa por hora base (salario mensual / 30 días / 8 horas)
  const hourlyRate = baseSalary / 30 / 8;

  // Horas extra diurnas: 100% adicional (doble)
  const dailyOvertimeRate = hourlyRate * 2;
  const dailyOvertimePay = dailyHours * dailyOvertimeRate;

  // Horas extra nocturnas: 125% adicional (más del doble)
  const nightlyOvertimeRate = hourlyRate * 2.25;
  const nightlyOvertimePay = nightlyHours * nightlyOvertimeRate;

  return {
    dailyOvertimePay: Number(dailyOvertimePay.toFixed(2)),
    nightlyOvertimePay: Number(nightlyOvertimePay.toFixed(2)),
    totalOvertimePay: Number((dailyOvertimePay + nightlyOvertimePay).toFixed(2))
  };
};

// Function to calculate the yearly bonus

export const calculateYearlyBonus = (
  monthlySalary: number,
  entryDate: string
): { totalBonus: number; taxableBonus: number } => {
  const dailySalary = monthlySalary / 30;
  let bonusDays = 0;
  const baseDate = new Date(new Date().getFullYear(), 11, 12);
  const entryDateObj = new Date(entryDate);
  const yearsOfService = baseDate.getFullYear() - entryDateObj.getFullYear();

  if (yearsOfService >= 1 && yearsOfService < 3) {
    bonusDays = 15;
  } else if (yearsOfService >= 3 && yearsOfService < 10) {
    bonusDays = 19;
  } else if (yearsOfService >= 10) {
    bonusDays = 21;
  } else {
    bonusDays = 15; // Base for proportional calculation
  }

  let totalBonus: number;
  if (yearsOfService < 1) {
    const millisecondsDifference = baseDate.getTime() - entryDateObj.getTime();
    const workedDays = millisecondsDifference / (1000 * 60 * 60 * 24);
    totalBonus = (dailySalary * bonusDays * workedDays) / 365;
  } else {
    totalBonus = dailySalary * bonusDays;
  }

  // Calculate taxable portion of aguinaldo
  const taxableBonus = Math.max(0, totalBonus - AGUINALDO_TAX_EXEMPT_LIMIT);

  return { totalBonus, taxableBonus };
};

// Function to calculate monthly income tax (ISR)
export const calculateISR = (taxableSalary: number): number => {
  let isr = 0;
  // Brackets according to El Salvador's monthly withholding table
  if (taxableSalary > 0.01 && taxableSalary <= 472.0) {
    isr = 0;
  } else if (taxableSalary > 472.0 && taxableSalary <= 895.24) {
    isr = (taxableSalary - 472.0) * 0.1 + 17.67;
  } else if (taxableSalary > 895.24 && taxableSalary <= 2038.1) {
    isr = (taxableSalary - 895.24) * 0.2 + 60.0;
  } else if (taxableSalary > 2038.1) {
    isr = (taxableSalary - 2038.1) * 0.3 + 288.57;
  }
  return isr;
};

  // Helper function to calculate vacation amount
  export const calculateVacation = (baseSalary: number): number => {
    // 15 days of salary + 30% of the 15 days
    const fifteenDaysSalary = (baseSalary / 30) * 15;
    return fifteenDaysSalary * 0.3;
  };

// Función para validar el descuento
export const validateDiscount = (discount: number, baseSalary: number): boolean => {
  const maxDiscount = baseSalary * 0.2;
  return discount >= 0 && discount <= maxDiscount;
};

  // State of employee's vacation
  export const getVacationStatus = (formData, employees) => {
    if (!formData.selectedEmployee || !formData.date) {
      return { eligible: false, hasUsed: false, message: "" };
    }

    const employee = employees.find(
      (emp) => emp.id === formData.selectedEmployee
    );
    if (!employee) {
      return {
        eligible: false,
        hasUsed: false,
        message: "Empleado no encontrado",
      };
    }

    const startDate = new Date(employee.startDate);
    const selectedDate = new Date(formData.date);
    const yearsSinceStart =
      (selectedDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365);

    // If it hasn't been a year since hiring
    if (yearsSinceStart < 1) {
      return {
        eligible: false,
        hasUsed: false,
        message: "Debe cumplir un año de trabajo para ser elegible",
      };
    }

    // Verify if the employee has already taken vacation in the selected year
    const hasVacationInSelectedYear = PayrollService.getPayrolls().some((p) => {
      const payrollDate = new Date(p.date);
      return (
        p.employeeId === employee.id &&
        p.includeVacation &&
        payrollDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    if (hasVacationInSelectedYear) {
      return {
        eligible: false,
        hasUsed: true,
        message: `Ya utilizó sus vacaciones en el año ${selectedDate.getFullYear()}`,
      };
    }

    return {
      eligible: true,
      hasUsed: false,
      message: "Elegible para vacaciones",
    };
  };