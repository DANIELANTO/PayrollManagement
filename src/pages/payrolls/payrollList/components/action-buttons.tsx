import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import PrintPayrollModal from "../../modal/planilla-modal";
import { PayrollService } from "../../services/payroll-service";
import { usePayrollStore } from "../../../../store/payroll-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

function ActionButtons({ payroll }) {
  const deletePayroll = usePayrollStore((state) => state.deletePayroll);

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar esta planilla?")) {
      PayrollService.deletePayroll(id);
      deletePayroll(id);
      PayrollService.getPayrolls();
    }
  };

  // Mobile dropdown menu
  const MobileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="md:hidden p-2">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            to={`/planilla/${payroll.id}`}
            className="flex items-center gap-2 text-blue-600"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        <PrintPayrollModal payroll={payroll} />
        <DropdownMenuItem
          onClick={() => handleDelete(payroll.id)}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Desktop actions
  const DesktopActions = () => (
    <div className="hidden md:flex items-center space-x-3">
      <Link
        to={`/planilla/${payroll.id}`}
        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
      >
        <Pencil className="w-4 h-4" />
        <span>Editar</span>
      </Link>
      <PrintPayrollModal payroll={payroll} />
      <button
        onClick={() => handleDelete(payroll.id)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
      >
        <Trash2 className="w-4 h-4" />
        <span>Eliminar</span>
      </button>
    </div>
  );

  return (
    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center">
      <MobileMenu />
      <DesktopActions />
      {/* Hidden button for print modal trigger */}
      <button id={`print-modal-${payroll.id}`} className="hidden">
        <PrintPayrollModal payroll={payroll} />
      </button>
    </td>
  );
}

export default ActionButtons;
