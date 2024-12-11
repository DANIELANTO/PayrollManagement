import { usePayrollStore } from "../../../../store/payroll-store";
import { MAX_OVERTIME_HOURS_PER_MONTH } from "../constants/constants";

// Check if a payroll already exists for the selected month and employee
export const isPayrollExistsForMonth = (
  employeeId: string,
  date: string
): boolean => {
  const selectedDate = new Date(date);
  const existingPayrolls = usePayrollStore.getState().payrolls;

  return existingPayrolls.some((payroll) => {
    const payrollDate = new Date(payroll.date);
    return (
      payroll.employeeId === employeeId &&
      payrollDate.getMonth() === selectedDate.getMonth() &&
      payrollDate.getFullYear() === selectedDate.getFullYear()
    );
  });
};

// Function to check if the date is December
export const isDecember = (date: string): boolean => {
  return new Date(date).getMonth() === 11; // 11 is december in JS
};

// function to validate the overtime hours
export const validateOvertimeHours = (
  dailyHours: number,
  nightlyHours: number
): { isValid: boolean; error: string } => {
  const totalHours = dailyHours + nightlyHours;

  if (dailyHours < 0 || nightlyHours < 0) {
    return {
      isValid: false,
      error: "Las horas extra no pueden ser negativas",
    };
  }

  if (totalHours > MAX_OVERTIME_HOURS_PER_MONTH) {
    return {
      isValid: false,
      error: `El total de horas extra no puede exceder ${MAX_OVERTIME_HOURS_PER_MONTH} horas al mes`,
    };
  }

  return {
    isValid: true,
    error: "",
  };
};
