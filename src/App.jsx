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
    <div className="min-h-screen bg-transparent text-ink lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
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
    <aside className="border-b border-white/70 bg-ink px-4 py-4 text-white shadow-[0_20px_60px_rgba(15,23,42,0.22)] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/[0.06] p-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-harvest to-amber-300 text-sm font-black text-ink shadow-glow">
            AE
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-sm font-extrabold tracking-tight">Account ERP</strong>
            <span className="block truncate text-xs font-semibold text-slate-300">Finance workspace</span>
          </div>
        </div>
        <Sparkles size={18} className="text-harvest" aria-hidden="true" />
      </div>

      <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label="Main navigation">
        {views.map((view) => {
          const Icon = view.icon;
          const active = activeView === view.id;
          return (
            <motion.button
              key={view.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(view.id)}
              aria-current={active ? "page" : undefined}
              className={`group flex min-h-12 items-center justify-center gap-2 rounded-[18px] px-3 py-2 text-sm font-extrabold transition duration-300 focus-ring lg:justify-start ${
                active
                  ? "bg-white text-ink shadow-xl shadow-black/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
              title={view.label}
            >
              <Icon size={18} className={active ? "text-brand-700" : "text-slate-400 transition group-hover:text-white"} aria-hidden="true" />
              <span>{view.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-6 hidden rounded-[22px] border border-white/10 bg-white/[0.05] p-4 lg:block">
        <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-300">
          <Command size={14} aria-hidden="true" />
          Workspace
        </div>
        <p className="text-sm leading-6 text-slate-300">Accounting operations, reports, and API tools in one focused control room.</p>
      </div>
    </aside>
  );
}

function Topbar({ title, query, setQuery, onRefresh }) {
  return (
    <header className="mb-5 rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-panel backdrop-blur-xl md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-700">Accounting module</p>
          <h1 className="truncate text-2xl font-black tracking-tight text-ink md:text-3xl">{title}</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative w-full sm:w-80">
            <span className="sr-only">Search records</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input
              className="input h-12 pl-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vendors, invoices, ledgers"
              type="search"
            />
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="button-secondary h-12 w-full sm:w-12 sm:px-0"
            onClick={onRefresh}
            title="Refresh active view"
            aria-label="Refresh active view"
          >
            <RefreshCw size={18} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function StatusStrip({ settings }) {
  return (
    <section className="mb-5 grid gap-3 md:grid-cols-3" aria-label="Connection status">
      <StatusItem label="Backend" value={settings.baseUrl} tone="blue" />
      <StatusItem label="Auth" value={settings.token ? "Token set" : "Token not set"} tone={settings.token ? "green" : "amber"} />
      <StatusItem label="Company" value={settings.companyId || "Not selected"} tone={settings.companyId ? "green" : "slate"} />
    </section>
  );
}

function StatusItem({ label, value, tone }) {
  const tones = {
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
  };
  return (
    <div className="rounded-[20px] border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur-xl">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-muted">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${tones[tone]}`} aria-hidden="true" />
        <strong className="block truncate text-sm font-extrabold">{value}</strong>
      </div>
    </div>
  );
}

function Dashboard({ setActiveView, setTransactionName, settings }) {
  const metrics = [
    ["Receivables", formatMoney(214400), "Sales invoices and receipts", WalletCards, "from-emerald-500 to-teal-600"],
    ["Payables", formatMoney(60800), "AP invoices and payments", FileText, "from-amber-500 to-orange-600"],
    ["Bank Balance", formatMoney(1280000), "Bank accounts and reconciliation", Building2, "from-sky-500 to-blue-600"],
    ["Open Work", "14", "Pending posting and approvals", ShieldCheck, "from-rose-500 to-pink-600"],
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, subtext, Icon, gradient], index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ delay: index * 0.04, duration: 0.24 }}
            className="panel group grid min-h-40 gap-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-muted">{label}</span>
              <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <strong className="text-2xl font-black tracking-tight md:text-3xl">{value}</strong>
            <div className="flex items-center justify-between gap-3">
              <small className="text-sm font-semibold text-muted">{subtext}</small>
              <ArrowRight className="text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-brand-700" size={18} aria-hidden="true" />
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
        <section className="panel min-h-96">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Pill icon={CircleDollarSign}>Finance Overview</Pill>
              <h2 className="mt-3 text-xl font-black tracking-tight">Cash movement snapshot</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                Live values appear here once the backend is running and a token is configured.
              </p>
            </div>
            <button className="button-secondary" onClick={() => setActiveView("reports")}>
              Open reports
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="grid h-64 grid-cols-7 items-end gap-3 rounded-[22px] border border-line/80 bg-gradient-to-br from-slate-50/90 to-slate-100/80 p-4">
            {bars.map((height, index) => (
              <div key={index} className="flex h-full flex-col justify-end gap-2">
                <motion.span
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 120, damping: 18 }}
                  className="min-h-8 rounded-t-[16px] bg-gradient-to-b from-brand-600 via-teal-500 to-harvest shadow-lg shadow-teal-900/10"
                />
                <span className="text-center text-[11px] font-bold text-slate-400">D{index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <Pill icon={Sparkles}>Quick Actions</Pill>
          <div className="mt-4 grid gap-3">
            {actions.map(([resource, label]) => (
              <motion.button
                key={resource}
                whileHover={{ x: 3, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group flex min-h-16 items-center justify-between rounded-[18px] border border-line bg-white px-4 py-3 text-left shadow-sm transition duration-300 hover:border-brand-200 hover:bg-brand-50 hover:shadow-soft focus-ring"
                onClick={() => {
                  setTransactionName(resource);
                  setActiveView("transactions");
                }}
              >
                <span>
                  <span className="block text-sm font-extrabold text-ink">{label}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-muted">{resource}</span>
                </span>
                <Plus size={18} className="text-brand-700 transition duration-300 group-hover:rotate-90" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
          <div className="mt-4 rounded-[20px] bg-slate-950 p-4 text-white shadow-glowStrong">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-300">Connection</span>
            <p className="mt-2 text-sm font-semibold">{settings.token ? "Backend token is configured." : "Add a token in API settings to enable live data."}</p>
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
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrent(name)}
            className={`rounded-2xl border p-4 text-left shadow-soft transition duration-250 focus-ring ${
              current === name ? "border-brand-600 bg-brand-50" : "border-white/70 bg-white/85 hover:border-brand-600"
            }`}
          >
            <strong className="block text-sm font-black">{name}</strong>
            <span className="mt-2 block text-sm leading-6 text-muted">{config.summary}</span>
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
        <div className="mb-4 flex flex-wrap gap-2">
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
            {loading ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <BarChart3 size={17} aria-hidden="true" />}
            Run report
          </button>
        }
      />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
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
      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="button-secondary" onClick={test} disabled={testing}>
          {testing ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <RefreshCw size={17} aria-hidden="true" />}
          Test connection
        </button>
        <button className="button-secondary" onClick={clear}>
          Clear
        </button>
      </div>
      <pre className="min-h-52 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-slate-950 p-4 text-sm leading-6 text-slate-100 shadow-inner">
        {apiResult}
      </pre>
    </section>
  );
}

function PanelHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>
        <h2 className="text-xl font-black tracking-tight text-ink">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Pill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-700">
      <Icon size={14} aria-hidden="true" />
      {children}
    </span>
  );
}

function Tabs({ names, current, setCurrent }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto rounded-[20px] border border-white/80 bg-white/75 p-2 shadow-soft backdrop-blur-xl" role="tablist">
      {names.map((name) => (
        <motion.button
          key={name}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrent(name)}
          role="tab"
          aria-selected={current === name}
          className={`min-h-11 shrink-0 rounded-[14px] px-4 py-2 text-sm font-extrabold transition duration-300 focus-ring ${
            current === name ? "bg-ink text-white shadow-lg shadow-slate-950/15" : "text-muted hover:bg-white hover:text-ink"
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
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">
        <Loader2 className="animate-spin" size={17} aria-hidden="true" />
        Loading live backend data
      </div>
    );
  }

  if (!notice) return null;
  return (
    <div className="mb-4 flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800">
      <AlertCircle className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
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
    <div className="overflow-hidden rounded-[22px] border border-line/80 bg-white shadow-soft">
      <div className="overflow-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50/90 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
            <tr>
              {fields.map((field) => (
                <th key={field} className="border-b border-line px-4 py-4">
                  {labelize(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/80">
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center" colSpan={fields.length}>
                  <EmptyState title="No records found" text="Try changing the search term or selected module." />
                </td>
              </tr>
            )}
            {filtered.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`} className="transition duration-200 hover:bg-slate-50/80">
                {row.map((value, cellIndex) => (
                  <td key={`${value}-${cellIndex}`} className="px-4 py-4 align-top font-semibold text-slate-700">
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
  if (/^\d+(\.\d+)?$/.test(text) && Number(text) > 999) return <span className="font-black text-ink">{formatMoney(Number(text))}</span>;
  const tone = badgeTone(text);
  if (tone !== "slate") return <Badge value={text} tone={tone} />;
  return text;
}

function Badge({ value, tone = badgeTone(value) }) {
  const classes = {
    green: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    gold: "bg-amber-50 text-amber-800 ring-amber-100",
    red: "bg-red-50 text-red-800 ring-red-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-black ring-1 ${classes[tone]}`}>{value}</span>;
}

function EmptyState({ title, text }) {
  return (
    <div className="mx-auto grid max-w-sm justify-items-center gap-2">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        <Search size={18} aria-hidden="true" />
      </div>
      <strong className="text-sm font-black text-ink">{title}</strong>
      <span className="text-sm text-muted">{text}</span>
    </div>
  );
}

function TableSkeleton({ columns }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-label="Loading table">
      <div className="grid gap-0">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-3 gap-4 border-b border-line p-4 md:grid-cols-6">
            {Array.from({ length: Math.min(columns, 6) }).map((_, index) => (
              <div key={index} className="h-4 animate-pulse rounded-full bg-slate-100" />
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
      <div className="grid min-h-56 gap-3 rounded-2xl border border-line bg-slate-50 p-4">
        <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="min-h-56 rounded-2xl border border-line bg-slate-50 p-4 text-sm">
      {!reportResult && (
        <div className="grid gap-3">
          <Badge value="Ready" />
          <strong className="text-base font-black">Select dates and run a report to see live backend output.</strong>
          <span className="max-w-3xl leading-6 text-muted">
            Trial balance, profit and loss, balance sheet, general ledger, and cash flow are ready as operational report surfaces.
          </span>
        </div>
      )}
      {reportResult?.type === "notice" && (
        <div className="flex items-start gap-2 text-amber-800">
          <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <strong>{reportResult.value}</strong>
        </div>
      )}
      {reportResult?.type === "json" && (
        <pre className="overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-slate-100">{JSON.stringify(reportResult.value, null, 2)}</pre>
      )}
    </div>
  );
}

function RecordModal({ modal, onClose }) {
  if (!modal) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-2xl rounded-[28px] border border-white/80 bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">New record</p>
            <h2 id="record-modal-title" className="text-xl font-black tracking-tight">
              Create {modal.title}
            </h2>
          </div>
          <button className="button-secondary h-10 w-10 px-0" onClick={onClose} title="Close" aria-label="Close modal">
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {modal.fields.map((field) => (
            <label key={field} className="field">
              {labelize(field)}
              <input className="input" type={field.toLowerCase().includes("date") ? "date" : "text"} aria-label={labelize(field)} />
            </label>
          ))}
        </div>
        <div className="mt-5 rounded-[20px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          <CheckCircle2 className="mr-2 inline" size={17} aria-hidden="true" />
          Form layout is ready for backend wiring.
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={onClose}>
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
