import Calendar from "react-calendar";
import { useEffect, useRef, useState } from "react";
import {
  calculateOvertimePay,
  calculateVacation,
  calculateYearlyBonus,
  getVacationStatus,
} from "../hooks/payroll-calculations";
import {
  isDecember,
  validateOvertimeHours,
} from "../hooks/payroll-validations";
import { formatCurrency } from "../../../../utils/format";
import { initialFormState } from "../constants/constants";

function EmployeeCardForm({ formData, setFormData, employees }) {
  // useState Hooks
  const [showCalendar, setShowCalendar] = useState(false);
  const [overtimeError, setOvertimeError] = useState<string>("");
  const [discountError, setDiscountError] = useState<string>("");

  // useEffect Hooks
  // Click outside calendar handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Personalized Hooks
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Constant for validation
  const MAX_OVERTIME_HOURS_PER_DAY = 4;
  const MAX_OVERTIME_HOURS_PER_MONTH = 64;

  // Handles
  const handleEmployeeChange = (employeeId: string) => {
    if (!employeeId) {
      setFormData(initialFormState);
      return;
    }

    setFormData((prev) => ({
      ...initialFormState,
      selectedEmployee: employeeId,
      date: prev.date,
      includeAguinaldo: false,
      aguinaldo: 0,
    }));
    updateBaseSalary(employeeId);
  };

  const handleOvertimeHoursChange = (
    type: "daily" | "nightly",
    hours: number
  ) => {
    const employee = employees.find(
      (emp) => emp.id === formData.selectedEmployee
    );
    if (!employee) return;

    const newOvertimeHours = {
      ...formData.overtimeHours,
      [type]: hours,
    };

    const validation = validateOvertimeHours(
      newOvertimeHours.daily ?? 0,
      newOvertimeHours.nightly ?? 0
    );

    if (!validation.isValid) {
      setOvertimeError(validation.error);
      return;
    }

    setOvertimeError("");
    const overtimeCalculation = calculateOvertimePay(
      newOvertimeHours.daily,
      newOvertimeHours.nightly,
      employee.baseSalary
    );

    newOvertimeHours.daily =
      newOvertimeHours.daily !== 0 ? newOvertimeHours.daily : "";
    newOvertimeHours.nightly =
      newOvertimeHours.nightly !== 0 ? newOvertimeHours.nightly : "";

    setFormData((prev) => ({
      ...prev,
      overtimeHours: newOvertimeHours,
      totalOvertimePay: overtimeCalculation.totalOvertimePay,
    }));
  };

  const handleDiscountChange = (value: number) => {
    const employee = employees.find(
      (emp) => emp.id === formData.selectedEmployee
    );
    if (!employee) return;

    const maxDiscount = employee.baseSalary * 0.2;

    if (value < 0) {
      setDiscountError("El descuento no puede ser negativo");
      return;
    }

    if (value > maxDiscount) {
      setDiscountError(
        `El descuento no puede ser mayor al 20% del salario base (${formatCurrency(
          maxDiscount
        )})`
      );
      return;
    }

    setDiscountError("");
    setFormData((prev) => ({
      ...prev,
      discount: value !== 0 ? value : "",
    }));
  };

  // Handler for the vacation checkbox change
  const handleVacationChange = (checked: boolean) => {
    const employee = employees.find(
      (emp) => emp.id === formData.selectedEmployee
    );
    if (!employee) return;

    const vacationAmount = checked ? calculateVacation(employee.baseSalary) : 0;
    setFormData((prev) => ({
      ...prev,
      includeVacation: checked,
      vacation: vacationAmount,
    }));
  };

  // Handler for the aguinaldo checkbox change
  const handleAguinaldoChange = (checked: boolean) => {
    const employee = employees.find(
      (emp) => emp.id === formData.selectedEmployee
    );

    if (!employee) return;

    const aguinaldoAmount = checked
      ? calculateYearlyBonus(employee.baseSalary, employee.startDate).totalBonus
      : 0;

    setFormData((prev) => ({
      ...prev,
      includeAguinaldo: checked,
      aguinaldo: aguinaldoAmount,
    }));
  };

  // Update base salary when employee is selected
  const updateBaseSalary = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      const baseSalaryPerQuinzena = employee.baseSalary / 2;
      const overtimePay = calculateOvertimePay(
        formData.overtimeHours.daily,
        formData.overtimeHours.daily,
        employee.baseSalary
      );
      setFormData((prev) => ({
        ...prev,
        firstQuinzena: baseSalaryPerQuinzena,
        secondQuinzena: baseSalaryPerQuinzena,
        ...overtimePay,
      }));
    }
  };

  //Format date
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  //Evaluate the vacation status
  const vacationStatus = getVacationStatus(formData, employees);

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empleado
            </label>
            <select
              value={formData.selectedEmployee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-11"
              required
            >
              <option value="">Seleccionar empleado</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="text"
              value={formData.date}
              onClick={() => setShowCalendar(true)}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
              required
            />
            {/* Calendario emergente */}
            {showCalendar && (
              <div className="absolute z-10 mt-1" ref={wrapperRef}>
                <Calendar
                  onChange={(value: Date) => {
                    if (value instanceof Date) {
                      setFormData({
                        ...formData,
                        date: formatDate(value),
                      });
                      setShowCalendar(false);
                    }
                  }}
                  value={formData.date ? new Date(formData.date) : new Date()}
                  onClickDay={() => setShowCalendar(false)}
                  className="border rounded-md shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horas Extra Diurnas
            </label>
            <input
              type="number"
              value={formData.overtimeHours.daily}
              onChange={(e) =>
                handleOvertimeHoursChange("daily", Number(e.target.value ?? 0))
              }
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                overtimeError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              min="0"
              max={MAX_OVERTIME_HOURS_PER_MONTH}
              step="1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Máximo {MAX_OVERTIME_HOURS_PER_DAY} horas por día,{" "}
              {MAX_OVERTIME_HOURS_PER_MONTH} horas al mes
            </p>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horas Extra Nocturnas
            </label>
            <input
              type="number"
              value={formData.overtimeHours.nightly}
              onChange={(e) =>
                handleOvertimeHoursChange(
                  "nightly",
                  Number(e.target.value ?? 0)
                )
              }
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                overtimeError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              min="0"
              max={MAX_OVERTIME_HOURS_PER_MONTH}
              step="1"
            />
            {overtimeError && (
              <p className="mt-1 text-sm text-red-600">{overtimeError}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descuento
          </label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => handleDiscountChange(Number(e.target.value ?? 0))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
              discountError
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            min="0"
            step="0.01"
          />
          {discountError && (
            <p className="mt-1 text-sm text-red-600">{discountError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bonificación
          </label>
          <input
            type="number"
            value={formData.bonus}
            onChange={(e) =>
              setFormData({
                ...formData,
                bonus: e.target.value ? Number(e.target.value) : "",
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeVacation"
              checked={formData.includeVacation}
              disabled={!vacationStatus.eligible || vacationStatus.hasUsed}
              onChange={(e) => handleVacationChange(e.target.checked)}
              className={`h-4 w-4 focus:ring-blue-500 border-gray-300 rounded ${
                !formData.selectedEmployee
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-blue-600 cursor-pointer"
              }`}
            />
            <label
              htmlFor="includeVacation"
              className={`ml-2 block text-sm ${
                !vacationStatus.eligible || vacationStatus.hasUsed
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-900 cursor-pointer"
              }`}
            >
              Incluir Vacaciones
              {!formData.selectedEmployee && (
                <span className="ml-2 text-xs text-gray-500">
                  (Seleccione un empleado primero)
                </span>
              )}
              {formData.selectedEmployee && !vacationStatus.eligible && !vacationStatus.hasUsed && (
                <span className="ml-2 text-xs text-gray-500">
                  (No elegible aún)
                </span>
              )}
              {vacationStatus.hasUsed && (
                <span className="ml-2 text-xs text-red-500">
                  (Ya utilizadas este año)
                </span>
              )}
            </label>
          </div>

          <div className="flex items-center">
            {!isDecember(formData.date)}
            <input
              type="checkbox"
              id="includeAguinaldo"
              checked={formData.includeAguinaldo}
              onChange={(e) => handleAguinaldoChange(e.target.checked)}
              disabled={
                !formData.selectedEmployee || isDecember(formData.date) !== true
              }
              className={`h-4 w-4 focus:ring-blue-500 border-gray-300 rounded ${
                !formData.selectedEmployee || isDecember(formData.date) !== true
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-blue-600 cursor-pointer"
              }`}
            />
            <label
              htmlFor="includeAguinaldo"
              className={`ml-2 block text-sm ${
                !formData.selectedEmployee || isDecember(formData.date) !== true
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-900 cursor-pointer"
              }`}
            >
              Incluir Aguinaldo
              {!formData.selectedEmployee && (
                <span className="ml-2 text-xs text-gray-500">
                  (Seleccione un empleado primero)
                </span>
              )}
              {!formData.selectedEmployee ||
                (isDecember(formData.date) !== true && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Disponible solo en diciembre)
                  </span>
                ))}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeCardForm;
