
import Analyse from "../components/analyse";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";


const AnalysePage: React.FC = () => {


  return (
     <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 overflow-auto bg-gray-900">
                    <Analyse />
                </div>
            </div>
        </div>
  );
};

export default AnalysePage;
