import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormState } from "../../../types";
import { MainLayout } from "../../../layouts/main-layout";
import { usePayrollStore } from "../../../store/payroll-store";
import { usePayrollCalculations } from "./hooks/payroll-calculations";
import { isPayrollExistsForMonth } from "./hooks/payroll-validations";
import "react-calendar/dist/Calendar.css";
import { useEmployeeStore } from "../../../store/employee-store.ts";
import EmployeeCardForm from "./components/employee-form.tsx";
import EmployeeCardDetail from "./components/employee-detail.tsx";
import EmployerCardDetail from "./components/employer-detail.tsx";
import EmployeeTop from "./components/employee-top.tsx";
import { initialFormState } from "./constants/constants";
import EmployeeSaveBottomButton from "./components/employee-save-bottom-button.tsx";

function PayrollForm() {

  // UseState Hooks
  const employees = useEmployeeStore((state) => state.employees);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  // Personalized Hooks
  const { id } = useParams();
  const calculations = usePayrollCalculations(formData);
  const navigate = useNavigate();
  const addPayroll = usePayrollStore((state) => state.addPayroll);
  const updatePayroll = usePayrollStore((state) => state.updatePayroll);
  const getPayrollById = usePayrollStore((state) => state.getPayrollById);


  // UseEffect Hooks
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

  // Handlers
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
      <div className="p-4 sm:p-10">
        {/* Title and Buttons */}
        <EmployeeTop id={id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow p-6">
            <form
              id="payrollForm"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Employees Card */}
              <EmployeeCardForm
                formData={formData}
                setFormData={setFormData}
                employees={employees}
              />
            </form>
          </div>

          {/* Resumen de Deducciones*/}
          <EmployeeCardDetail formData={formData} calculations={calculations} />

          {/* Aportaciones del Patrono */}
          <EmployerCardDetail calculations={calculations} />

          {/* Save Bottom Button For Small Devices */}
          <EmployeeSaveBottomButton/>
        </div>
      </div>
    </MainLayout>
  );
}

export default PayrollForm;
