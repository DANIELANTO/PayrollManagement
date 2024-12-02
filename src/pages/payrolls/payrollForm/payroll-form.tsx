import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "../../../utils/format";
import { FormState } from "../../../types";
import { MainLayout } from "../../../layouts/main-layout";
import { usePayrollStore } from "../../../store/payroll-store";
import EmployeeCard from "./components/employee-card.tsx";
import {
  usePayrollCalculations,
} from "./hooks/payroll-calculations";
import {
  isPayrollExistsForMonth,
} from "./hooks/payroll-validations";
import "react-calendar/dist/Calendar.css";
import { useEmployeeStore } from "../../../store/employee-store.ts";

export const initialFormState: FormState = {


  selectedEmployee: "",
  date: new Date().toISOString().split("T")[0],
  firstQuinzena: '',
  secondQuinzena: '',
  overtimeHours: {
    daily: '',
    nightly: '',
  },
  totalOvertimePay: '',
  bonus: '',
  discount: '',
  vacation: '',
  includeVacation: false,
  includeAguinaldo: false,
  aguinaldo: '',
};

function PayrollForm() {

  const employees = useEmployeeStore((state) => state.employees);



  const [formData, setFormData] = useState<FormState>(initialFormState);

  const navigate = useNavigate();
  const { id } = useParams();

  
  const addPayroll = usePayrollStore((state) => state.addPayroll);
  const updatePayroll = usePayrollStore((state) => state.updatePayroll);
  const getPayrollById = usePayrollStore((state) => state.getPayrollById);

  // Calculations and totals
  const calculations = usePayrollCalculations(formData);

  // ===========> EFFECTS

  useEffect(() => {
    if (id && id !== "add") {
      const payroll = getPayrollById(id);
      if (payroll) {
        setFormData({
          selectedEmployee: payroll.employeeId,
          date: payroll.date,
          firstQuinzena: Number(payroll.firstQuinzena).toFixed(2),
          secondQuinzena: Number(payroll.secondQuinzena).toFixed(2),
          overtimeHours: {
            daily: Number(payroll.overtimeHours?.daily).toFixed(2),
            nightly: Number(payroll.overtimeHours?.nightly).toFixed(2),
          },
          totalOvertimePay: Number(payroll.totalOvertimePay).toFixed(2),
          bonus: Number(payroll.bonus).toFixed(2),
          discount: Number(payroll.discount).toFixed(2),
          vacation: Number(payroll.vacation).toFixed(2),
          includeVacation: payroll.includeVacation,
          includeAguinaldo: payroll.includeAguinaldo || false,
          aguinaldo: Number(payroll.aguinaldo).toFixed(2),
        });
      }
    }
  }, [id, getPayrollById]);

  // ===========> HANDLERS







  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const employeeData = employees.find(
      (emp) => emp.id === formData.selectedEmployee
    );
    if (!employeeData) return;

    // if (discountError || overtimeError) {
    //   alert(
    //     "Por favor corrija los errores en el formulario antes de continuar."
    //   );
    //   return;
    // }

    if (
      id === "add" &&
      isPayrollExistsForMonth(formData.selectedEmployee, formData.date)
    ) {
      alert(
        "Ya existe una planilla para este empleado en el mes seleccionado."
      );
      return;
    }

    const payroll = {
      id: id !== "add" ? id! : Date.now().toString(),
      employeeId: employeeData.id,
      employeeName: employeeData.name,
      ...formData,
      ...calculations,
      employerIsss: calculations.employerIsss,
      employerAfp: calculations.employerAfp,
      insaforp: calculations.insaforp,
      totalEmployerContributions: calculations.totalEmployerContributions,
    };

    try {
      if (id !== "add") {
        updatePayroll(payroll);
      } else {
        addPayroll(payroll);
      }
      navigate("/planillas");
    } catch (error) {
      alert("Error al guardar la planilla. Por favor, intente nuevamente.");
      console.error("Error saving payroll:", error);
    }
  };

  return (
    <MainLayout>
      <div className="p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {id !== "add" ? "Editar Planilla" : "Crear Planilla"}
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/planillas")}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              form="payrollForm"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow p-6">
            <form
              id="payrollForm"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
            {/* Employees Card */}
            <EmployeeCard
              formData={formData} 
              setFormData={setFormData} 
              employees={employees}
            />
            </form>
          </div>

          {/* Resumen de Deducciones*/}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Detalle de Planilla
            </h2>
            <div className="space-y-3">
              {/* Ingresos */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Ingresos del Empleado
                </h3>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Salario Quincena 1</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(formData.firstQuinzena))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salario Quincena 2</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(formData.secondQuinzena))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Horas Extras ({(formData.overtimeHours.daily) + (formData.overtimeHours.nightly)} horas)
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(Number(formData.totalOvertimePay))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonificación</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(formData.bonus))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vacaciones</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(formData.vacation))}
                    </span>
                  </div>
                  {formData.includeAguinaldo && (
                    <div className="flex justify-between">
                      <span>Aguinaldo</span>
                      <span className="font-semibold">
                        {formatCurrency(Number(formData.aguinaldo))}
                      </span>
                    </div>
                  )}
                  {Number(formData.discount) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Descuento</span>
                      <span className="font-semibold">
                        -{formatCurrency(Number(formData.discount))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Salario Bruto</span>
                    <span>{formatCurrency(Number(calculations.grossSalary))}</span>
                  </div>
                </div>
              </div>

              {/* Deducciones del Empleado */}
              <div className="border-t pt-3">
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Deducciones del Empleado
                </h3>
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ISSS (3%)</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(calculations.isss))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AFP (7.25%)</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(calculations.afp))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retención Renta</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(calculations.rent))}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total Deducciones</span>
                    <span>{formatCurrency(Number(calculations.totalDeductions))}</span>
                  </div>
                </div>
              </div>

              {/* Totales Finales */}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Salario Neto Empleado</span>
                  <span>{formatCurrency(Number(calculations.netSalary))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aportaciones del Patrono */}
          <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Aportaciones del Patrono
            </h2>
            <div className="space-y-3">
              {/* Aportaciones del Patrono */}
              <div className="border-t pt-3">
                <div className="pl-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ISSS Patronal (7.5%)</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(calculations.employerIsss))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AFP Patronal (8.75%)</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(calculations.employerAfp))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>INSAFORP (1%)</span>
                    <span className="font-semibold">
                      {formatCurrency(Number(calculations.insaforp))}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t text-blue-600">
                    <span>Total Aportaciones Patronales</span>
                    <span>
                      {formatCurrency(Number(calculations.totalEmployerContributions))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Totales Finales */}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg mt-2 text-blue-600">
                  <span>Costo Total Empresa</span>
                  <span>
                    {formatCurrency(
                      Number(calculations.grossSalary) +
                      Number(calculations.totalEmployerContributions)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PayrollForm;
