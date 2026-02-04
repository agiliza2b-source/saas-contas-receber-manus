import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart3, Users, FileText, CreditCard, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    label: "Clientes",
    icon: <Users className="w-5 h-5" />,
    href: "/clientes",
  },
  {
    label: "Faturamento",
    icon: <FileText className="w-5 h-5" />,
    href: "/faturamento",
  },
  {
    label: "Contas a Receber",
    icon: <CreditCard className="w-5 h-5" />,
    href: "/contas-receber",
  },
  {
    label: "Cobrança",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/cobranca",
  },
  {
    label: "Configurações",
    icon: <Settings className="w-5 h-5" />,
    href: "/configuracoes",
  },
];

export default function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header com Logo e Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">AG</span>
            </div>
            <span className="font-semibold text-sidebar-foreground text-sm truncate">Agiliza</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
                !isActive && "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              onClick={() => navigate(item.href)}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
