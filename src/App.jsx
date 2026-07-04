import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Settings,
  ArrowRightLeft,
  Command,
} from "lucide-react";
import { ApiProvider, useApi } from "./context/ApiContext";
import { ToastContainer } from "./components/ToastContainer";
import { VendorsView } from "./views/VendorsView";
import { CustomersView } from "./views/CustomersView";
import { SalesInvoicesView } from "./views/SalesInvoicesView";

const views = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "customers", label: "Customers", icon: Building2 },
  { id: "sales-invoices", label: "Sales Invoices", icon: ArrowRightLeft },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "api", label: "API Settings", icon: Settings },
];

const pageMotion = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

function AppContent() {
  const [activeView, setActiveView] = useState("dashboard");
  const { settings } = useApi();

  const activeTitle = views.find((view) => view.id === activeView)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="min-w-0 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{activeTitle}</h1>
        </div>

        <StatusStrip settings={settings} />

        <AnimatePresence mode="wait">
          {activeView === "dashboard" && (
            <MotionView key="dashboard">
              <Dashboard setActiveView={setActiveView} settings={settings} />
            </MotionView>
          )}

          {activeView === "vendors" && (
            <MotionView key="vendors">
              <VendorsView />
            </MotionView>
          )}

          {activeView === "customers" && (
            <MotionView key="customers">
              <CustomersView />
            </MotionView>
          )}

          {activeView === "sales-invoices" && (
            <MotionView key="sales-invoices">
              <SalesInvoicesView />
            </MotionView>
          )}

          {activeView === "reports" && (
            <MotionView key="reports">
              <Reports />
            </MotionView>
          )}

          {activeView === "api" && (
            <MotionView key="api">
              <ApiSettings />
            </MotionView>
          )}
        </AnimatePresence>
      </main>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}

function MotionView({ children }) {
  return (
    <motion.section
      variants={pageMotion}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-5"
    >
      {children}
    </motion.section>
  );
}

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-6 lg:shadow-sm">
      <div className="mb-8 flex items-center justify-between gap-3 rounded-xl border border-slate-200/50 bg-gradient-to-br from-indigo-50 to-indigo-50/50 p-3 lg:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30">
            AE
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-sm font-bold text-slate-900">Account ERP</strong>
            <span className="block truncate text-xs font-medium text-slate-500">Finance module</span>
          </div>
        </div>
      </div>

      <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label="Main navigation">
        {views.map((view) => {
          const Icon = view.icon;
          const active = activeView === view.id;
          return (
            <motion.button
              key={view.id}
              whileTap={{ scale: 0.96 }}
              whileHover={{ x: active ? 0 : 4 }}
              onClick={() => setActiveView(view.id)}
              aria-current={active ? "page" : undefined}
              className={`group flex min-h-10 items-center justify-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 lg:justify-start ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={view.label}
            >
              <Icon size={16} className={`transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} aria-hidden="true" />
              <span>{view.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-8 hidden rounded-lg border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-50/50 p-4 lg:block">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          <Command size={13} aria-hidden="true" />
          Info
        </div>
        <p className="text-xs leading-relaxed text-slate-600">Manage vendors, customers, invoices, and reports in one place.</p>
      </div>
    </aside>
  );
}

function StatusStrip({ settings }) {
  return (
    <section className="mb-8 grid gap-3 md:grid-cols-3" aria-label="Connection status">
      <StatusItem label="Backend" value={settings.baseUrl} tone="blue" />
      <StatusItem label="Auth" value={settings.token ? "Token set" : "Token not set"} tone={settings.token ? "green" : "amber"} />
      <StatusItem label="Company" value={settings.companyId || "Not selected"} tone={settings.companyId ? "green" : "slate"} />
    </section>
  );
}

function StatusItem({ label, value, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
  };
  return (
    <div className="rounded-lg border border-slate-200/60 bg-white/95 p-4 shadow-sm">
      <span className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ring-3 ${tones[tone]}`} aria-hidden="true" />
        <strong className="block truncate text-sm font-semibold text-slate-900">{value}</strong>
      </div>
    </div>
  );
}

function Dashboard({ setActiveView, settings }) {
  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Welcome to Account ERP</h2>
        <p className="text-slate-600 mb-6">
          This is your finance dashboard. Use the navigation menu to manage vendors, customers, invoices, and reports.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveView("vendors")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            Manage Vendors
          </button>
          <button
            onClick={() => setActiveView("customers")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            Manage Customers
          </button>
          <button
            onClick={() => setActiveView("sales-invoices")}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            Create Invoice
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-2">Connection Status</h3>
        <p className="text-sm text-slate-600">{settings.token ? "✓ Backend token configured" : "⚠ Add token in API Settings"}</p>
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Reports</h2>
      <p className="text-slate-600 mt-2">Reports feature coming soon...</p>
    </div>
  );
}

function ApiSettings() {
  const { settings, updateSettings } = useApi();

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateSettings({
      baseUrl: formData.get("baseUrl"),
      token: formData.get("token"),
      companyId: formData.get("companyId"),
      userId: formData.get("userId"),
    });
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">API Configuration</h2>
        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Base URL
            </label>
            <input
              type="text"
              name="baseUrl"
              defaultValue={settings.baseUrl}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="http://localhost:8081"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Bearer Token
            </label>
            <input
              type="password"
              name="token"
              defaultValue={settings.token}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your bearer token"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Company ID
            </label>
            <input
              type="text"
              name="companyId"
              defaultValue={settings.companyId}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter company ID"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              defaultValue={settings.userId}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter user ID"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
