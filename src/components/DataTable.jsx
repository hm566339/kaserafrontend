import { ChevronRight, Eye, Trash2, Edit2 } from "lucide-react";
import { SkeletonLoader } from "./SkeletonLoader";

export function DataTable({
  columns,
  data,
  loading,
  onRowClick,
  onEdit,
  onDelete,
  keyField = "id",
}) {
  if (loading) {
    return <SkeletonLoader count={8} height="h-12" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-slate-600">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left font-semibold text-slate-700"
              >
                {col.label}
              </th>
            ))}
            {(onRowClick || onEdit || onDelete) && (
              <th className="px-6 py-3 text-right font-semibold text-slate-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row[keyField] || idx}
              className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 text-slate-900"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onRowClick || onEdit || onDelete) && (
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onRowClick && (
                      <button
                        onClick={() => onRowClick(row)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
