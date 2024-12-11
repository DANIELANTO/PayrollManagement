import { formatCurrency } from "../../../../utils/format";

function EmployerCardDetail({ calculations }) {
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Aportaciones del Patrono</h2>
        <div className="space-y-3">
          {/* Aportaciones del Patrono */}
          <div className="border-t pt-3">
            <div className="pl-0 sm:pl-4 space-y-2 text-sm">
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
                <span>Total Aportaciones <br className="inline-block sm:hidden"/> Patronales</span>
                <span>
                  {formatCurrency(
                    Number(calculations.totalEmployerContributions)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Totales Finales */}
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold lg:font-bold text-base sm:text-lg mt-2 text-blue-600">
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
    </>
  );
}

export default EmployerCardDetail;
