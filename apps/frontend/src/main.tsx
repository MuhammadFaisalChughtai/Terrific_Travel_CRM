import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeStore } from "./store/theme.store";
import "./index.css";

import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Tours from "./pages/Tours";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
// import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AgentPage from "./pages/Agent";
import VendorPage from "./pages/Vendor";
import LedgerPage from "./pages/Ledger";
import InvoicesPage from "./pages/Invoices";
import InvoiceTemplatesPage from "./pages/InvoiceTemplates";
import PassengerForm from "./pages/PassengerForm";
import UsersPage from "./pages/Users";
import Attendance from "./pages/Attendance";
import AgentMargins from "./pages/AgentMargins";
import { useAuthStore } from "./store/auth.store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRouter() {
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        {/* <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} /> */}

        <Route
          path="/"
          element={user ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="flights" element={<Flights />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="tours" element={<Tours />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
          {/* <Route path="reports" element={<Reports />} /> */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="agent" element={<AgentPage />} />
          <Route path="vendors" element={<VendorPage />} />
          <Route path="ledger" element={<LedgerPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoice-templates" element={<InvoiceTemplatesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="agent-margins" element={<AgentMargins />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

        {/* Public — no auth required */}
        <Route path="/passenger-form/:token" element={<PassengerForm />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            width: "400px", // Set your desired width here
            maxWidth: "100vw", // Prevents overflow on small mobile screens
          },
        }}
        theme={theme as "light" | "dark" | "system"}
        closeButton
        richColors
      />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>,
);
