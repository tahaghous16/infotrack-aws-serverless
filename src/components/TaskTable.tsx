import { Loader2, Pencil, Trash2, Users } from "lucide-react";
import { Task } from "@/services/api";

interface TaskTableProps {
  tasks?: Task[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskTable({
  tasks = [],
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: TaskTableProps) {
  /* ---------- Loading State ---------- */
  if (isLoading && tasks.length === 0) {
    return (
      <div className="card-elevated p-12 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading records...</p>
      </div>
    );
  }

  /* ---------- Empty State ---------- */
  if (!tasks || tasks.length === 0) {
    return (
      <div className="card-elevated p-12 flex flex-col items-center justify-center text-muted-foreground">
        <Users className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No records found</p>
        <p className="text-sm mt-1">
          Create your first record using the form above
        </p>
      </div>
    );
  }

  /* ---------- Table ---------- */
  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="table-header">ID</th>
              <th className="table-header">Name</th>
              <th className="table-header">Email</th>
              <th className="table-header">Age</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {tasks.map((task, index) => (
              <tr
                key={task.id ?? index}
                className="hover:bg-secondary/30 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* ID */}
                <td className="table-cell">
                  <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {task.id ? `${task.id.slice(0, 8)}...` : "N/A"}
                  </span>
                </td>

                {/* Name */}
                <td className="table-cell font-medium">{task.name ?? "-"}</td>

                {/* Email */}
                <td className="table-cell text-muted-foreground">
                  {task.email ?? "-"}
                </td>

                {/* Age */}
                <td className="table-cell">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {task.age ?? "-"}
                  </span>
                </td>

                {/* Actions */}
                <td className="table-cell">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      disabled={!task.id || deletingId === task.id}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit record"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => task.id && onDelete(task.id)}
                      disabled={!task.id || deletingId === task.id}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete record"
                    >
                      {deletingId === task.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
