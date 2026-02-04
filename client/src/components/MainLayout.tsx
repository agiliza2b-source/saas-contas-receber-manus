import { cn } from "@/lib/utils";
import { useState } from "react";
import SidebarNav from "./SidebarNav";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64",
          className
        )}
      >
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
