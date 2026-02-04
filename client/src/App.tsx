import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Faturamento from "./pages/Faturamento";
import ContasReceber from "./pages/ContasReceber";
import Cobranca from "./pages/Cobranca";
import Configuracoes from "./pages/Configuracoes";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground">Carregando...</p>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">Esta página está em desenvolvimento.</p>
    </div>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="" component={Home} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/clientes" component={Clientes} />
        <Route path="/faturamento" component={Faturamento} />
        <Route path="/contas-receber" component={ContasReceber} />
        <Route path="/cobranca" component={Cobranca} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
