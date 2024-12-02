import React from 'react'
import { Printer, X } from 'lucide-react'
import { formatCurrency } from '../../../utils/format'
import { Payroll } from '../../../types'

const PrintPayrollModal = ({ payroll }: { payroll: Payroll }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const printRef = React.useRef<HTMLDivElement>(null)

  const generatePrintTemplate = (payroll: Payroll) => {
    return `
      <html>
        <head>
          <title>Planilla - ${payroll.employeeName}</title>
          <style>
            @page {
              margin: 2cm;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
  
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
  
            .header {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
            }
  
            .company-info {
              text-align: left;
            }
  
            .company-name {
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
  
            .company-details {
              font-size: 12px;
              color: #666;
              line-height: 1.4;
            }
  
            .document-info {
              text-align: right;
              font-size: 14px;
            }
  
            .document-title {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 5px;
            }
  
            .document-date {
              color: #666;
              font-size: 12px;
            }
  
            .payroll-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
  
            .payroll-table th,
            .payroll-table td {
              padding: 8px 12px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
  
            .payroll-table th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #4b5563;
              width: 30%;
            }
  
            .payroll-table td {
              width: 70%;
            }
  
            .amount {
              text-align: right;
              font-family: 'Courier New', Courier, monospace;
            }
  
            .deduction {
              color: #dc2626;
            }
  
            .total-row {
              font-weight: bold;
              background-color: #f8fafc;
            }
  
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-top: 60px;
              padding: 20px;
            }
  
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 40px;
              padding-top: 10px;
              text-align: center;
              font-size: 14px;
            }
  
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
  
            @media print {
              button { display: none; }
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <div class="company-info">
                <div class="company-name">Taller Mecánico "Rodriguez y Asociados"</div>
                <div class="company-details">
                  San Salvador, El Salvador <br>
                  Teléfono: (503) 7539-2732<br>
                  Email: tallerezRodriguez@gmail.com
                </div>
              </div>
              <div class="document-info">
                <div class="document-title">Boleta de Pago</div>
                <div class="document-date">${new Date(payroll.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}</div>
              </div>
            </div>
  
            <table class="payroll-table">
              <tbody>
                <tr>
                  <th>Empleado</th>
                  <td>${payroll.employeeName}</td>
                </tr>
                <tr>
                  <th>Salario Base</th>
                  <td class="amount">$${(payroll.firstQuinzena + payroll.secondQuinzena + 0)?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Horas Extra</th>
                  <td class="amount">$${payroll.overtimePay?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Bonos</th>
                  <td class="amount">$${payroll.bonus?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Otros:</th>
                  <td class="amount">$${(payroll.vacation + payroll.aguinaldo || 0 + 0)?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>ISSS</th>
                  <td class="amount deduction">-$${payroll.isss?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>AFP</th>
                  <td class="amount deduction">-$${payroll.afp?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Renta</th>
                  <td class="amount deduction">-$${payroll.rent?.toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Total Deducciones</th>
                  <td class="amount deduction">-$${payroll.totalDeductions?.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <th>Salario Neto</th>
                  <td class="amount">$${payroll.netSalary?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
  
            <div class="signatures">
              <div>
                <div class="signature-line">Firma del Empleado</div>
              </div>
              <div>
                <div class="signature-line">Firma del Empleador</div>
              </div>
            </div>
  
            <div class="footer">
              <p>Documento generado el ${new Date().toLocaleDateString('es-ES')}</p>
              <p>Este documento es una representación digital de la planilla de pago</p>
            </div>
          </div>
  
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `
  }

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600')

      if (printWindow === null) {
        throw new Error('No se pudo abrir la ventana de impresión')
      }

      printWindow.document.write(generatePrintTemplate(payroll))
      printWindow.document.close()
    } catch (error) {
      console.error('Error al imprimir:', error)
      alert('Hubo un error al intentar imprimir. Por favor, inténtelo de nuevo.')
    }
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const userTimezone = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.getTime() + userTimezone)

    return adjustedDate.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden md:inline">Imprimir</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div ref={printRef} className="print-container">
              <div className="header pb-4">
                <h2 className="text-xl font-bold">Boleta de Pago</h2>
                <p className="text-sm text-gray-600">{formatDisplayDate(payroll.date)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-2 border-b">
                  <span className="font-semibold text-gray-600">Empleado:</span>
                  <span className="float-right">{payroll.employeeName}</span>
                </div>

                <div className="p-2 border-b">
                  <span className="font-semibold text-gray-600">Salario Base:</span>
                  <span className="float-right">
                    {formatCurrency(payroll.firstQuinzena + payroll.secondQuinzena)}
                  </span>
                </div>

                {payroll.overtimePay > 0 && (
                  <div className="p-2 border-b">
                    <span className="font-semibold text-gray-600">
                      Horas Extra ({payroll.overtimeHours} horas):
                    </span>
                    <span className="float-right">{formatCurrency(payroll.overtimePay)}</span>
                  </div>
                )}

                {payroll.bonus > 0 && (
                  <div className="p-2 border-b">
                    <span className="font-semibold text-gray-600">Bonos:</span>
                    <span className="float-right">{formatCurrency(payroll.bonus)}</span>
                  </div>
                )}

                {payroll.vacation > 0 && (
                  <div className="p-2 border-b">
                    <span className="font-semibold text-gray-600">Vacaciones:</span>
                    <span className="float-right">{formatCurrency(payroll.vacation)}</span>
                  </div>
                )}

                {payroll.aguinaldo > 0 && (
                  <div className="p-2 border-b">
                    <span className="font-semibold text-gray-600">Aguinaldo:</span>
                    <span className="float-right">{formatCurrency(payroll.aguinaldo)}</span>
                  </div>
                )}

                <div className="p-2 border-b">
                  <span className="font-semibold text-gray-600">ISSS:</span>
                  <span className="float-right text-red-600">-{formatCurrency(payroll.isss)}</span>
                </div>

                <div className="p-2 border-b">
                  <span className="font-semibold text-gray-600">AFP:</span>
                  <span className="float-right text-red-600">-{formatCurrency(payroll.afp)}</span>
                </div>

                <div className="p-2 border-b">
                  <span className="font-semibold text-gray-600">Renta:</span>
                  <span className="float-right text-red-600">-{formatCurrency(payroll.rent)}</span>
                </div>

                <div className="p-2 border-b">
                  <span className="font-semibold text-gray-600">Total Deducciones:</span>
                  <span className="float-right text-red-600">
                    -{formatCurrency(payroll.totalDeductions)}
                  </span>
                </div>

                <div className="p-2 border-b col-span-2">
                  <span className="font-bold text-gray-600">Salario Neto:</span>
                  <span className="float-right font-bold text-green-600">
                    {formatCurrency(payroll.netSalary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PrintPayrollModal
