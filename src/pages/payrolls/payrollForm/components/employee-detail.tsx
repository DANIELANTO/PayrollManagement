import { formatCurrency } from "../../../../utils/format";

function EmployeeCardDetail({ formData, calculations }) {
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Detalle de Planilla</h2>
        <div className="space-y-3">
          {/* Ingresos */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">
              Ingresos del Empleado
            </h3>
            <div className="pl-0 sm:pl-4 space-y-2 text-sm">
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
                  Horas Extras (
                  {formData.overtimeHours.daily +
                    formData.overtimeHours.nightly}{" "}
                  horas)
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
            <div className="pl-0 sm:pl-4 space-y-2 text-sm">
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
                <span>
                  {formatCurrency(Number(calculations.totalDeductions))}
                </span>
              </div>
            </div>
          </div>

          {/* Totales Finales */}
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold lg:font-bold text-base sm:text-lg">
              <span>Salario Neto Empleado</span>
              <span>{formatCurrency(Number(calculations.netSalary))}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeCardDetail;
