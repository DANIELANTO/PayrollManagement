import { FormState } from "../../../../types";

// Constant for validation
export const MAX_OVERTIME_HOURS_PER_MONTH = 64;

export const initialFormState: FormState = {
  selectedEmployee: "",
  date: new Date().toISOString().split("T")[0],
  firstQuinzena: "",
  secondQuinzena: "",
  overtimeHours: {
    daily: "",
    nightly: "",
  },
  totalOvertimePay: "",
  bonus: "",
  discount: "",
  vacation: "",
  includeVacation: false,
  includeAguinaldo: false,
  aguinaldo: "",
};
