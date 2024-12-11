import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton({url}) {
    const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate(url)}
        className="px-4 py-2 sm:bg-black text-white sm:rounded-lg hover:bg-gray-800 transition-colors sm:static
        fixed top-4 left-8 rounded-full"
      >
        <ArrowBackIcon className="text-white mb-1 mr-1" fontSize="medium" />
        <span className="hidden sm:inline-block">Volver</span>
      </button>
    </>
  );
}

export default BackButton;
