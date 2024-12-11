import { Link } from "react-router-dom";
import BackButton from "../../../../components/back-button";

function LisTop() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="hidden sm:inline text-2xl font-bold text-gray-800">
          Generación de Planillas
        </h1>
        <h1 className="inline sm:hidden text-2xl font-bold text-gray-800">
          Planillas
        </h1>
        <div className="space-x-4">
          {/* <Link
            to="/"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Volver
          </Link> */}
          <BackButton url="/" />
          <Link
            to="/planilla/add"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Crear Planilla
          </Link>
        </div>
      </div>
    </>
  );
}

export default LisTop;
