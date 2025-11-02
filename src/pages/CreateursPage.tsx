import Createurs from "../components/createurs";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const CreateursPage = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 overflow-auto bg-gray-100">
                    <Createurs />
                </div>
            </div>
        </div>
    );
};

export default CreateursPage;
