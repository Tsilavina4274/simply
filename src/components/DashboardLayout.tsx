// src/components/DashboardLayout.tsx

import { Sidebar } from "lucide-react";
import type { ReactNode } from "react";


interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-5 overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
