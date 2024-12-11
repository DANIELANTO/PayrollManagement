import SaveIcon from '@mui/icons-material/Save';
import BackButton from '../../../../components/back-button';

function EmployeeTop({ id }) {

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id !== "add" ? "Editar Planilla" : "Crear Planilla"}
        </h1>
        <div className="space-x-4">
          <BackButton url="/planillas" />
          <button
            type="submit"
            form="payrollForm"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors hidden sm:inline-block"
          >
            <SaveIcon className='text-white mb-1 mr-1' fontSize="medium" />
            {id !== "add" ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </>
  );
}

export default EmployeeTop;
