// DashboardPage.tsx
import DashboardContent from "../components/DashboardContent";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-0">
        <Navbar />

        <div className="flex-1 overflow-auto bg-gray-900">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
