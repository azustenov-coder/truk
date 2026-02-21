import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/Dashboard";
import { OrdersPage } from "./pages/Orders";
import { DispatchBoardPage } from "./pages/DispatchBoard";
import { FleetManagementPage } from "./pages/FleetManagement";
import { DriversPage } from "./pages/Drivers";
import { RoutesTrackingPage } from "./pages/RoutesTracking";
import { WarehousesPage } from "./pages/Warehouses";
import { ProofOfDeliveryPage } from "./pages/ProofOfDelivery";
import { BillingPage } from "./pages/Billing";
import { ReportsPage } from "./pages/Reports";
import { AIAssistantPage } from "./pages/AIAssistant";
import { SettingsPage } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "orders", Component: OrdersPage },
      { path: "dispatch", Component: DispatchBoardPage },
      { path: "fleet", Component: FleetManagementPage },
      { path: "drivers", Component: DriversPage },
      { path: "routes", Component: RoutesTrackingPage },
      { path: "warehouses", Component: WarehousesPage },
      { path: "proof-of-delivery", Component: ProofOfDeliveryPage },
      { path: "billing", Component: BillingPage },
      { path: "reports", Component: ReportsPage },
      { path: "ai-assistant", Component: AIAssistantPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
