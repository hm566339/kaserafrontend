import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Command,
  FileText,
  LayoutDashboard,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { masterResources, reportEndpoints, transactionResources } from "./data";
import { badgeTone, extractRows, formatMoney, labelize } from "./utils";

const views = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "masters", label: "Masters", icon: Building2 },
  { id: "transactions", label: "Transactions", icon: ArrowRightLeft },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "api", label: "API", icon: Settings },
];

const defaultSettings = {
  baseUrl: "http://localhost:8081",
  token: "",
  companyId: "",
  userId: "",
};

const pageMotion = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [settings, setSettings] = useState(() => ({
    baseUrl: localStorage.getItem("accountErp.baseUrl") || defaultSettings.baseUrl,
    token: localStorage.getItem("accountErp.token") || "",
    companyId: localStorage.getItem("accountErp.companyId") || "",
    userId: localStorage.getItem("accountErp.userId") || "",
  }));
  const [masterName, setMasterName] = useState("Vendors");
  const [transactionName, setTransactionName] = useState("Sales Invoices");
  const [modal, setModal] = useState(null);
  const [apiResult, setApiResult] = useState("No request sent yet.");
  const [reportResult, setReportResult] = useState(null);

  const activeTitle = views.find((view) => view.id === activeView)?.label || "Dashboard";

  const apiFetch = async (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (settings.token) headers.Authorization = `Bearer ${settings.token}`;
    if (settings.companyId) headers["X-Company-Id"] = settings.companyId;
    if (settings.userId) headers["X-User-Id"] = settings.userId;

    const response = await fetch(`${settings.baseUrl.replace(/\/$/, "")}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
    const text = await response.text();
    const body = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(body?.message || body?.error || `Request failed with ${response.status}`);
    return body;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="min-w-0 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
        <Topbar title={activeTitle} query={query} setQuery={setQuery} onRefresh={() => setReportResult(null)} />
        <StatusStrip settings={settings} />

        <AnimatePresence mode="wait">
          {activeView === "dashboard" && (
            <MotionView key="dashboard">
              <Dashboard setActiveView={setActiveView} setTransactionName={setTransactionName} settings={settings} />
            </MotionView>
          )}

          {activeView === "masters" && (
            <MotionView key="masters">
              <Masters
                apiFetch={apiFetch}
                current={masterName}
                query={query}
                setCurrent={setMasterName}
                setModal={setModal}
                token={settings.token}
              />
            </MotionView>
          )}

          {activeView === "transactions" && (
            <MotionView key="transactions">
              <Transactions
                apiFetch={apiFetch}
                current={transactionName}
                query={query}
                setCurrent={setTransactionName}
                setModal={setModal}
                token={settings.token}
              />
            </MotionView>
          )}

          {activeView === "reports" && (
            <MotionView key="reports">
              <Reports apiFetch={apiFetch} reportResult={reportResult} setReportResult={setReportResult} token={settings.token} />
            </MotionView>
          )}

          {activeView === "api" && (
            <MotionView key="api">
              <ApiSettings
                apiFetch={apiFetch}
                apiResult={apiResult}
                setApiResult={setApiResult}
                settings={settings}
                setSettings={setSettings}
              />
            </MotionView>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        <RecordModal modal={modal} onClose={() => setModal(null)} />
      </AnimatePresence>
    </div>
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
              className={`group flex min-h-10 items-center justify-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-300 focus-ring lg:justify-start ${
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

function Topbar({ title, query, setQuery, onRefresh }) {
  return (
    <header className="mb-8 space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">Dashboard</p>
        <h1 className="truncate text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative w-full sm:flex-1 sm:max-w-sm">
          <span className="sr-only">Search records</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
          <input
            className="input w-full pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search vendors, invoices..."
            type="search"
          />
        </label>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="button-secondary h-10 w-full sm:w-10 sm:px-0"
          onClick={onRefresh}
          title="Refresh active view"
          aria-label="Refresh active view"
        >
          <RefreshCw size={16} aria-hidden="true" />
        </motion.button>
      </div>
    </header>
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

function Dashboard({ setActiveView, setTransactionName, settings }) {
  const metrics = [
    ["Receivables", formatMoney(214400), "Sales invoices and receipts", WalletCards, "bg-gradient-to-br from-emerald-500 to-teal-600"],
    ["Payables", formatMoney(60800), "AP invoices and payments", FileText, "bg-gradient-to-br from-amber-500 to-orange-600"],
    ["Bank Balance", formatMoney(1280000), "Bank accounts and reconciliation", Building2, "bg-gradient-to-br from-blue-500 to-cyan-600"],
    ["Open Work", "14", "Pending posting and approvals", ShieldCheck, "bg-gradient-to-br from-rose-500 to-pink-600"],
  ];
  const bars = [46, 72, 38, 84, 58, 67, 49];
  const actions = [
    ["Sales Invoices", "New sales invoice"],
    ["AP Invoices", "Record AP invoice"],
    ["GL Journals", "Create journal"],
    ["Bank Transactions", "Reconcile bank"],
  ];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, subtext, Icon, gradient], index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="panel group grid min-h-44 gap-4 overflow-hidden border-slate-200/60"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
              <span className={`grid h-10 w-10 place-items-center rounded-lg ${gradient} text-white shadow-lg shadow-slate-900/20`}>
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <strong className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{value}</strong>
            <div className="flex items-end justify-between gap-3 mt-auto">
              <small className="text-xs font-medium text-slate-600">{subtext}</small>
              <ArrowRight className="text-indigo-300 transition-all duration-300 group-hover:translate-x-2 group-hover:text-indigo-600" size={16} aria-hidden="true" />
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="panel min-h-96 border-slate-200/60">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Pill icon={CircleDollarSign}>Finance Overview</Pill>
              <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-900">Cash movement</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Real-time values from your backend when connected.
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="button-secondary" 
              onClick={() => setActiveView("reports")}
            >
              View reports
              <ChevronRight size={16} aria-hidden="true" />
            </motion.button>
          </div>
          <div className="grid h-64 grid-cols-7 items-end gap-3 rounded-xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100/50 p-5">
            {bars.map((height, index) => (
              <div key={index} className="flex h-full flex-col justify-end gap-2">
                <motion.span
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.06, type: "spring", stiffness: 100, damping: 16 }}
                  className="min-h-2 rounded-t-lg bg-gradient-to-b from-indigo-600 via-indigo-500 to-indigo-400 shadow-md shadow-indigo-900/20"
                />
                <span className="text-center text-xs font-semibold text-slate-500">D{index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel border-slate-200/60">
          <Pill icon={Sparkles}>Quick Actions</Pill>
          <div className="mt-5 grid gap-2.5">
            {actions.map(([resource, label]) => (
              <motion.button
                key={resource}
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                className="group flex min-h-14 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 focus-ring"
                onClick={() => {
                  setTransactionName(resource);
                  setActiveView("transactions");
                }}
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{label}</span>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">{resource}</span>
                </span>
                <Plus size={16} className="text-indigo-600 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-slate-200/50 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Connection status</span>
            <p className="mt-2 text-sm font-medium">{settings.token ? "✓ Backend token configured" : "⚠ Add token in API settings"}</p>
          </div>
        </section>
      </div>
    </>
  );
}

function Masters({ apiFetch, current, query, setCurrent, setModal, token }) {
  const resource = masterResources[current];
  const [rows, setRows] = useState(resource.sample);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setRows(resource.sample);
    setNotice("");
    setLoading(Boolean(token));

    if (!token) return undefined;
    apiFetch(resource.endpoint)
      .then((body) => {
        if (ignore) return;
        const liveRows = extractRows(body, resource.listKey, resource.fields);
        if (liveRows.length) setRows(liveRows);
      })
      .catch((error) => {
        if (!ignore) setNotice(`Live request failed: ${error.message}. Showing sample data.`);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [current, token]);

  return (
    <>
      <Tabs names={Object.keys(masterResources)} current={current} setCurrent={setCurrent} />
      <section className="panel">
        <PanelHeader
          eyebrow="Master data"
          title={current}
          description={`${resource.endpoint} mapped from the backend API.`}
          action={
            <button className="button-primary" onClick={() => setModal({ title: current, fields: resource.fields })}>
              <Plus size={17} aria-hidden="true" />
              Create
            </button>
          }
        />
        <StateBanner notice={notice} loading={loading} />
        {loading ? <TableSkeleton columns={resource.fields.length} /> : <DataTable fields={resource.fields} rows={rows} query={query} />}
      </section>
    </>
  );
}

function Transactions({ apiFetch, current, query, setCurrent, setModal, token }) {
  const resource = transactionResources[current];
  const [rows, setRows] = useState(resource.sample);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setRows(resource.sample);
    setNotice("");
    setLoading(Boolean(token));

    if (!token) return undefined;
    apiFetch(resource.endpoint)
      .then((body) => {
        if (ignore) return;
        const liveRows = extractRows(body, null, resource.fields);
        if (liveRows.length) setRows(liveRows);
      })
      .catch((error) => {
        if (!ignore) setNotice(`Live request failed: ${error.message}. Showing sample data.`);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [current, token]);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(transactionResources).map(([name, config]) => (
          <motion.button
            key={name}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCurrent(name)}
            className={`rounded-lg border p-4 text-left transition-all duration-300 focus-ring ${
              current === name 
                ? "border-indigo-300 bg-indigo-50 shadow-md shadow-indigo-600/10" 
                : "border-slate-200 bg-white shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
            }`}
          >
            <strong className="block text-sm font-semibold text-slate-900">{name}</strong>
            <span className="mt-2 block text-xs leading-relaxed text-slate-600">{config.summary}</span>
          </motion.button>
        ))}
      </div>

      <section className="panel">
        <PanelHeader
          eyebrow="Transactions"
          title={current}
          description="Use the action bar for approve, post, cancel, and payment updates."
          action={
            <button className="button-primary" onClick={() => setModal({ title: current, fields: resource.fields.slice(0, 5) })}>
              <Plus size={17} aria-hidden="true" />
              Create transaction
            </button>
          }
        />
        <div className="mb-6 flex flex-wrap gap-2">
          <button className="button-secondary">Approve</button>
          <button className="button-secondary">Post</button>
          <button className="button-secondary">Mark paid</button>
          <button className="button-danger">Cancel</button>
        </div>
        <StateBanner notice={notice} loading={loading} />
        {loading ? <TableSkeleton columns={resource.fields.length} /> : <DataTable fields={resource.fields} rows={rows} query={query} />}
      </section>
    </>
  );
}

function Reports({ apiFetch, reportResult, setReportResult, token }) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  const [reportName, setReportName] = useState("Trial Balance");
  const [fromDate, setFromDate] = useState(monthStart);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    if (!token) {
      setReportResult({ type: "notice", value: "Set a bearer token in API settings to run live reports." });
      return;
    }

    const params = new URLSearchParams({ fromDate, toDate });
    setLoading(true);
    try {
      const body = await apiFetch(`${reportEndpoints[reportName]}?${params}`);
      setReportResult({ type: "json", value: body });
    } catch (error) {
      setReportResult({ type: "notice", value: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <PanelHeader
        eyebrow="Reporting"
        title="Reports"
        description="Run accounting reports from the Spring Boot reporting controllers."
        action={
          <button className="button-primary" onClick={runReport} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <BarChart3 size={16} aria-hidden="true" />}
            {loading ? "Running..." : "Run report"}
          </button>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <label className="field">
          Report
          <select className="input" value={reportName} onChange={(event) => setReportName(event.target.value)}>
            {Object.keys(reportEndpoints).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label className="field">
          From
          <input className="input" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        </label>
        <label className="field">
          To
          <input className="input" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </label>
      </div>
      <ReportOutput reportResult={reportResult} loading={loading} />
    </section>
  );
}

function ApiSettings({ apiFetch, apiResult, setApiResult, settings, setSettings }) {
  const [draft, setDraft] = useState(settings);
  const [testing, setTesting] = useState(false);

  const persist = (next) => {
    setSettings(next);
    localStorage.setItem("accountErp.baseUrl", next.baseUrl);
    localStorage.setItem("accountErp.token", next.token);
    localStorage.setItem("accountErp.companyId", next.companyId);
    localStorage.setItem("accountErp.userId", next.userId);
  };

  const save = () => {
    const next = {
      baseUrl: draft.baseUrl.trim().replace(/\/$/, "") || defaultSettings.baseUrl,
      token: draft.token.trim(),
      companyId: draft.companyId.trim(),
      userId: draft.userId.trim(),
    };
    persist(next);
    setApiResult("Settings saved.");
    return next;
  };

  const clear = () => {
    Object.keys(defaultSettings).forEach((key) => localStorage.removeItem(`accountErp.${key}`));
    setDraft(defaultSettings);
    setSettings(defaultSettings);
    setApiResult("Settings cleared.");
  };

  const test = async () => {
    save();
    setTesting(true);
    setApiResult("Testing backend...");
    try {
      const body = await apiFetch("/api-docs");
      setApiResult(
        JSON.stringify(
          {
            ok: true,
            title: body?.info?.title,
            version: body?.info?.version,
            paths: body?.paths ? Object.keys(body.paths).length : 0,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setApiResult(`Connection failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <section className="panel">
      <PanelHeader
        eyebrow="Developer tools"
        title="API Connection"
        description="Set the backend URL and token used by this frontend."
        action={
          <button className="button-primary" onClick={save}>
            Save settings
          </button>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="field">
          Backend URL
          <input className="input" value={draft.baseUrl} onChange={(event) => update("baseUrl", event.target.value)} />
        </label>
        <label className="field">
          Bearer token
          <input className="input" type="password" value={draft.token} onChange={(event) => update("token", event.target.value)} placeholder="Paste access token" />
        </label>
        <label className="field">
          Company ID
          <input className="input" value={draft.companyId} onChange={(event) => update("companyId", event.target.value)} placeholder="Optional company UUID" />
        </label>
        <label className="field">
          User ID
          <input className="input" value={draft.userId} onChange={(event) => update("userId", event.target.value)} placeholder="Optional user UUID" />
        </label>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button className="button-secondary" onClick={test} disabled={testing}>
          {testing ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <RefreshCw size={16} aria-hidden="true" />}
          Test connection
        </button>
        <button className="button-secondary" onClick={clear}>
          Clear
        </button>
      </div>
      <pre className="min-h-52 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200/50 bg-slate-900 p-5 text-xs leading-relaxed text-slate-100 shadow-sm font-mono">
        {apiResult}
      </pre>
    </section>
  );
}

function PanelHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">{eyebrow}</p>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Pill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700">
      <Icon size={12} aria-hidden="true" />
      {children}
    </span>
  );
}

function Tabs({ names, current, setCurrent }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-slate-200/50 bg-slate-50/50 p-1.5 shadow-sm" role="tablist">
      {names.map((name) => (
        <motion.button
          key={name}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setCurrent(name)}
          role="tab"
          aria-selected={current === name}
          className={`min-h-10 shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-ring ${
            current === name ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-700 hover:bg-white hover:text-slate-900"
          }`}
        >
          {name}
        </motion.button>
      ))}
    </div>
  );
}

function StateBanner({ notice, loading }) {
  if (loading) {
    return (
      <div className="mb-5 flex items-center gap-3 rounded-lg border border-blue-200/50 bg-blue-50/80 px-4 py-3 text-sm font-medium text-blue-700 shadow-sm">
        <Loader2 className="animate-spin shrink-0" size={16} aria-hidden="true" />
        Loading live backend data...
      </div>
    );
  }

  if (!notice) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200/50 bg-amber-50/80 px-4 py-3 text-sm font-medium leading-relaxed text-amber-800 shadow-sm">
      <AlertCircle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
      {notice}
    </div>
  );
}

function DataTable({ fields, rows, query }) {
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => row.join(" ").toLowerCase().includes(needle));
  }, [query, rows]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/60 bg-white shadow-sm">
      <div className="overflow-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600 border-b border-slate-200/60">
            <tr>
              {fields.map((field) => (
                <th key={field} className="px-5 py-3.5 font-semibold">
                  {labelize(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {filtered.length === 0 && (
              <tr>
                <td className="px-5 py-12 text-center" colSpan={fields.length}>
                  <EmptyState title="No records found" text="Try changing the search term or selected module." />
                </td>
              </tr>
            )}
            {filtered.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`} className="transition-colors duration-200 hover:bg-slate-50/60">
                {row.map((value, cellIndex) => (
                  <td key={`${value}-${cellIndex}`} className="px-5 py-4 align-top font-medium text-slate-700">
                    <Cell value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ value }) {
  const text = String(value);
  if (/^\d+(\.\d+)?$/.test(text) && Number(text) > 999) return <span className="font-bold text-slate-900">{formatMoney(Number(text))}</span>;
  const tone = badgeTone(text);
  if (tone !== "slate") return <Badge value={text} tone={tone} />;
  return text;
}

function Badge({ value, tone = badgeTone(value) }) {
  const classes = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    gold: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return <span className={`inline-flex min-h-6 items-center rounded-full px-3 py-0.5 text-xs font-semibold ring-1 ${classes[tone]}`}>{value}</span>;
}

function EmptyState({ title, text }) {
  return (
    <div className="mx-auto grid max-w-sm justify-items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
        <Search size={18} aria-hidden="true" />
      </div>
      <strong className="text-sm font-semibold text-slate-900">{title}</strong>
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}

function TableSkeleton({ columns }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/60 bg-white" aria-label="Loading table">
      <div className="grid gap-0">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-3 gap-4 border-b border-slate-200/50 p-5 md:grid-cols-6">
            {Array.from({ length: Math.min(columns, 6) }).map((_, index) => (
              <div key={index} className="h-3 animate-pulse rounded-full bg-slate-200" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportOutput({ reportResult, loading }) {
  if (loading) {
    return (
      <div className="grid min-h-56 gap-3 rounded-lg border border-slate-200/60 bg-slate-50/50 p-5">
        <div className="h-3 w-32 animate-pulse rounded-full bg-slate-300" />
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-300" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-300" />
        <div className="h-28 animate-pulse rounded-lg bg-slate-300" />
      </div>
    );
  }

  return (
    <div className="min-h-56 rounded-lg border border-slate-200/60 bg-slate-50/50 p-5 text-sm">
      {!reportResult && (
        <div className="grid gap-3">
          <Badge value="Ready" />
          <strong className="text-base font-semibold text-slate-900">Select dates and run a report to see live backend output.</strong>
          <span className="max-w-3xl leading-relaxed text-slate-600">
            Trial balance, profit and loss, balance sheet, general ledger, and cash flow are ready as operational report surfaces.
          </span>
        </div>
      )}
      {reportResult?.type === "notice" && (
        <div className="flex items-start gap-3 text-amber-700">
          <AlertCircle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
          <strong className="text-sm font-medium">{reportResult.value}</strong>
        </div>
      )}
      {reportResult?.type === "json" && (
        <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-sm text-slate-100 border border-slate-700 font-mono">{JSON.stringify(reportResult.value, null, 2)}</pre>
      )}
    </div>
  );
}

function RecordModal({ modal, onClose }) {
  if (!modal) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl rounded-lg border border-slate-200/60 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">New record</p>
            <h2 id="record-modal-title" className="text-lg font-bold tracking-tight text-slate-900">
              Create {modal.title}
            </h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="button-secondary h-10 w-10 shrink-0 px-0" 
            onClick={onClose} 
            title="Close" 
            aria-label="Close modal"
          >
            <X size={16} aria-hidden="true" />
          </motion.button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modal.fields.map((field) => (
            <label key={field} className="field">
              {labelize(field)}
              <input className="input" type={field.toLowerCase().includes("date") ? "date" : "text"} aria-label={labelize(field)} />
            </label>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-emerald-200/50 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
          <CheckCircle2 className="mr-2 inline" size={16} aria-hidden="true" />
          Form layout is ready for backend wiring.
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={onClose}>
            Create record
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
