import SaveIcon from '@mui/icons-material/Save'

function EmployeeSaveBottomButton() {
  return (
    <>
      <button
        type="submit"
        form="payrollForm"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block sm:hidden"
      >
        <SaveIcon className="text-white mb-1 mr-1" fontSize="medium" />
        Guardar
      </button>
    </>
  );
}

export default EmployeeSaveBottomButton;
