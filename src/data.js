export const masterResources = {
  Vendors: {
    endpoint: "/api/account/v1/vendors",
    listKey: "vendors",
    fields: ["vendorCode", "vendorName", "email", "phone", "gstin", "isActive"],
    sample: [
      ["VEN-001", "Acme Supplies", "accounts@acme.test", "+91 98765 43210", "27ABCDE1234F1Z5", "Active"],
      ["VEN-002", "Nexa Logistics", "billing@nexa.test", "+91 97654 32109", "29ABCDE1234F1Z7", "Active"],
    ],
  },
  Customers: {
    endpoint: "/api/account/customers",
    listKey: "customers",
    fields: ["customerCode", "customerName", "email", "phone", "gstin", "status"],
    sample: [
      ["CUS-001", "Prism Retail", "finance@prism.test", "+91 90000 10001", "07ABCDE1234F1Z2", "Active"],
      ["CUS-002", "Metro Foods", "ap@metro.test", "+91 90000 10002", "09ABCDE1234F1Z4", "Active"],
    ],
  },
  "Chart of Accounts": {
    endpoint: "/api/account/chart-of-accounts",
    listKey: "accounts",
    fields: ["accountCode", "accountName", "accountType", "accountNature", "openingBalance", "isActive"],
    sample: [
      ["1000", "Cash in Hand", "ASSET", "DEBIT", "125000", "Active"],
      ["4000", "Sales Revenue", "INCOME", "CREDIT", "0", "Active"],
    ],
  },
  "Bank Accounts": {
    endpoint: "/api/account/bank-accounts",
    listKey: "bankAccounts",
    fields: ["bankName", "accountNumber", "ifscCode", "accountType", "openingBalance", "isActive"],
    sample: [
      ["HDFC Bank", "22440000123", "HDFC0001234", "CURRENT", "850000", "Active"],
      ["ICICI Bank", "55440000987", "ICIC0005678", "CURRENT", "430000", "Active"],
    ],
  },
  "GST Slabs": {
    endpoint: "/api/account/gst-slabs",
    listKey: "gstSlabs",
    fields: ["name", "rate", "cgstRate", "sgstRate", "igstRate", "isActive"],
    sample: [
      ["GST 18", "18", "9", "9", "18", "Active"],
      ["GST 5", "5", "2.5", "2.5", "5", "Active"],
    ],
  },
};

export const transactionResources = {
  "Sales Invoices": {
    endpoint: "/api/account/sales/invoices",
    summary: "AR invoices, approvals, posting, and payment status.",
    fields: ["invoiceNumber", "customerName", "invoiceDate", "totalAmount", "invoiceStatus", "paymentStatus"],
    sample: [
      ["SI-2026-001", "Prism Retail", "2026-07-01", "84500", "DRAFT", "UNPAID"],
      ["SI-2026-002", "Metro Foods", "2026-07-03", "129900", "APPROVED", "PARTIAL"],
    ],
  },
  "AP Invoices": {
    endpoint: "/api/account/ap-invoices",
    summary: "Vendor invoices, e-invoice state, posting, and payments.",
    fields: ["invoiceNumber", "vendorName", "invoiceDate", "totalAmount", "status", "paymentStatus"],
    sample: [
      ["AP-2026-041", "Acme Supplies", "2026-07-01", "42000", "APPROVED", "UNPAID"],
      ["AP-2026-042", "Nexa Logistics", "2026-07-02", "18800", "DRAFT", "UNPAID"],
    ],
  },
  "GL Journals": {
    endpoint: "/api/account/gl-journal-entries",
    summary: "Manual journal entries and posting workflow.",
    fields: ["journalNumber", "journalDate", "description", "totalDebit", "totalCredit", "postingStatus"],
    sample: [
      ["JV-2026-009", "2026-07-02", "Opening adjustment", "15000", "15000", "POSTED"],
      ["JV-2026-010", "2026-07-04", "Accrual entry", "7200", "7200", "DRAFT"],
    ],
  },
  "Bank Transactions": {
    endpoint: "/api/account/bank-transactions",
    summary: "Cash movement and reconciliation actions.",
    fields: ["transactionDate", "bankName", "transactionType", "amount", "referenceNumber", "reconciled"],
    sample: [
      ["2026-07-01", "HDFC Bank", "CREDIT", "84500", "UTR001293", "Yes"],
      ["2026-07-03", "ICICI Bank", "DEBIT", "18800", "UTR001315", "No"],
    ],
  },
};

export const reportEndpoints = {
  "Trial Balance": "/api/account/reports/trial-balance",
  "Profit and Loss": "/api/account/reports/profit-loss",
  "Balance Sheet": "/api/account/reports/balance-sheet",
  "General Ledger": "/api/account/reports/general-ledger",
  "Cash Flow": "/api/account/reports/cash-flow",
};
