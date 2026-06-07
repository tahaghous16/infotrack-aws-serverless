import { useState, useEffect } from "react";
import { Loader2, Plus, Save, X } from "lucide-react";
import { Task, CreateTaskData } from "@/services/api";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setName(task.name);
      setEmail(task.email);
      setAge(task.age.toString());
    } else {
      setName("");
      setEmail("");
      setAge("");
    }
    setErrors({});
  }, [task]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    const ageNum = parseInt(age, 10);
    if (!age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      newErrors.age = "Please enter a valid age (0-150)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      age: parseInt(age, 10),
    });

    if (!isEditing) {
      setName("");
      setEmail("");
      setAge("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? "Edit Record" : "Create New Record"}
        </h2>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input-field ${
              errors.name ? "border-destructive ring-1 ring-destructive" : ""
            }`}
            placeholder="Enter name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-field ${
              errors.email ? "border-destructive ring-1 ring-destructive" : ""
            }`}
            placeholder="Enter email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`input-field ${
              errors.age ? "border-destructive ring-1 ring-destructive" : ""
            }`}
            placeholder="Enter age"
            min="0"
            max="150"
            disabled={isLoading}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-destructive">{errors.age}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="
      flex items-center gap-2
      px-5 py-2.5
      bg-slate-800 text-white
      rounded-lg
      font-medium
      shadow-md
      hover:bg-slate-700
      active:scale-95
      transition-all duration-200
      disabled:opacity-60 disabled:cursor-not-allowed
    "
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEditing ? (
            <Save className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isEditing ? "Update Record" : "Create Record"}
        </button>
      </div>
    </form>
  );
}
