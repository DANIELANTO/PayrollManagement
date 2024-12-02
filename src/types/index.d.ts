import { Role } from "./roleEnum";

export interface User {
	id: number;
	username: string;
	password: string;
	picture?: string;
	role: Role;
}

export interface Employee {
	id: string;
	name: string;
	baseSalary: number;
	startDate: string;
	position: string;
	department: string;
  }

  export interface Payroll {
	id: string;
	employeeId: string;
	employeeName: string;
	date: string;
	grossSalary: string;
	firstQuinzena: string;
	secondQuinzena: string;
	overtimeHours: {
	  daily: string;
	  nightly: string;
	};
	totalOvertimePay: string;
	bonus: string;
	discount: string;
	vacation: string;
	isss: string;
	afp: string;
	rent: string;
	totalDeductions: string;
	netSalary: string;
	includeVacation: boolean;
	employerIsss: string;
	employerAfp: string;
	insaforp: string;
	totalEmployerContributions: string;
	includeAguinaldo: boolean;
	aguinaldo: string;
  }

  export interface FormState {
	selectedEmployee: string
	date: string;
	firstQuinzena: string;
	secondQuinzena: string;
	overtimeHours: {
	  daily: string;
	  nightly: string;
	};
	totalOvertimePay: string;
	bonus: string;
	discount: string;
	vacation: string;
	includeVacation: boolean;
	includeAguinaldo: boolean;
	aguinaldo: string;
  }
