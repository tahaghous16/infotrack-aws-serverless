import { useState, useEffect, useCallback } from "react";
import { Database, RefreshCw, Loader2 } from "lucide-react";
import { taskApi, Task, CreateTaskData } from "@/services/api";
import { TaskForm } from "@/components/TaskForm";
import { TaskTable } from "@/components/TaskTable";
import { ToastContainer } from "@/components/Toast";

interface ToastItem {
  id: string;
  type: "success" | "error";
  message: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskApi.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      addToast("error", "Failed to load records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (data: CreateTaskData) => {
    setIsSubmitting(true);
    try {
      const newTask = await taskApi.create(data);
      setTasks((prev) => [...prev, newTask]);
      addToast("success", "Record created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);

      if (error?.message) {
        try {
          const parsed = JSON.parse(error.message);
          addToast("error", parsed.message || "Failed to create record.");
        } catch {
          addToast("error", error.message);
        }
      } else {
        addToast("error", "Failed to create record. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateTaskData) => {
    if (!editingTask) return;

    setIsSubmitting(true);
    try {
      const updatedTask = await taskApi.update(editingTask.id, data);

      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
      );

      setEditingTask(null);
      addToast("success", "Record updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      let errorMessage = "Failed to update record. Please try again.";
      if (error && typeof error === "object") {
        const anyError = error as any;
        if (anyError.message) {
          try {
            const parsed = JSON.parse(anyError.message);
            errorMessage = parsed.message || parsed.error || anyError.message;
          } catch {
            errorMessage = anyError.message;
          }
        }
        if (anyError.response?.data?.message) {
          errorMessage = anyError.response.data.message;
        }
      }
      addToast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await taskApi.delete(id);
      await fetchTasks();
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
      addToast("success", "Record deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      let errorMessage = "Failed to delete record. Please try again.";
      // Direct ApiError message (may be JSON string)
      if (error && typeof error === "object") {
        const anyError = error as any;
        if (anyError.message) {
          try {
            const parsed = JSON.parse(anyError.message);
            errorMessage = parsed.message || parsed.error || anyError.message;
          } catch {
            errorMessage = anyError.message;
          }
        }
        // Nested response payload (e.g., Axios style)
        if (anyError.response && anyError.response.data && anyError.response.data.message) {
          errorMessage = anyError.response.data.message;
        }
      }
      addToast("error", errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  InfoTrack
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage and track records
                </p>
              </div>
            </div>
            <button
              onClick={fetchTasks}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Form Section */}
          <section>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={editingTask ? handleCancelEdit : undefined}
              isLoading={isSubmitting}
            />
          </section>

          {/* Table Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                All Records
                {tasks.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({tasks.length} {tasks.length === 1 ? "record" : "records"})
                  </span>
                )}
              </h2>
            </div>
            <TaskTable
              tasks={tasks}
              isLoading={isLoading}
              deletingId={deletingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Index;
