// planilla-service.tsx

import { usePayrollStore } from '../../../store/payroll-store'
import { Payroll } from '../../../types'

export const PayrollService = {
  getPayrolls: (): Payroll[] => {
    return usePayrollStore.getState().payrolls
  },

  getPayrollById: (id: string) => {
    return usePayrollStore.getState().getPayrollById(id)
  },

  savePayroll: (payroll: Payroll) => {
    usePayrollStore.getState().addPayroll(payroll)
  },

  updatePayroll: (payroll: Payroll) => {
    usePayrollStore.getState().updatePayroll(payroll)
  },

  deletePayroll: (id: string) => {
    usePayrollStore.getState().deletePayroll(id)
  }
}
