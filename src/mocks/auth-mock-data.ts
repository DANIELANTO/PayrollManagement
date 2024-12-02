import { User } from "../types";
import { Role } from "../types/roleEnum";

export const mockUsers: User[] = [
	{
		id: 1,
		username: "admin",
		password: "admin",
		role: Role.admin,
	},
	{
		id: 2,
		username: "user",
		password: "user",
		role: Role.user,
	},
	{
		id: 3,
		username: "general",
		password: "general",
		role: Role.general,
	},
];
