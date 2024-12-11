// planilla-list.tsx
import { Calendar } from "lucide-react";
import { formatCurrency } from "../../../utils/format";
import { MainLayout } from "../../../layouts/main-layout";
import { usePayrollStore } from "../../../store/payroll-store";
import { formatDisplayDate } from "../../../utils/datetimeUtil";
import LisTop from "./components/list-top";
import ActionButtons from "./components/action-buttons";

function PlanillaList() {
  const payrolls = usePayrollStore((state) => state.payrolls);

  return (
    <MainLayout>
      <div className="p-4 sm:p-10">
        <LisTop />
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {payrolls.length !== 0 ? (
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Salario Base
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Bonos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Deducciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Salario Neto
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
              ) : (
                ""
              )}
              <tbody className="bg-white divide-y divide-gray-200">
                {payrolls.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-400"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
                          />
                          <path
                            fill="currentColor"
                            opacity="0.5"
                            d="M8 14h8v2H8v-2zm0-3h8v2H8v-2z"
                          />
                        </svg>
                        <div className="text-gray-500 text-lg font-medium">
                          No hay planillas registradas
                        </div>
                        <div className="text-gray-400">
                          Comienza creando una nueva planilla usando el botón
                          "Crear Planilla"
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payrolls.map((payroll) => {
                    const totalBonos =
                      (Number(payroll.bonus) || 0) +
                      (Number(payroll.vacation) || 0);
                    const baseSalary =
                      payroll.firstQuinzena + payroll.secondQuinzena;
                    // +
                    // (payroll.overtimePay || 0);

                    return (
                      <tr key={payroll.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payroll.employeeName}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDisplayDate(payroll.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(Number(baseSalary))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(totalBonos)}
                            {Number(payroll.vacation) > 0 && (
                              <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Vacaciones
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(Number(payroll.totalDeductions))}
                            <div className="text-xs text-gray-500">
                              ISSS: {formatCurrency(Number(payroll.isss))} |
                              AFP: {formatCurrency(Number(payroll.afp))} | ISR:{" "}
                              {formatCurrency(Number(payroll.rent))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(Number(payroll.netSalary))}
                          </div>
                        </td>
                        <ActionButtons payroll="payroll" />
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PlanillaList;
