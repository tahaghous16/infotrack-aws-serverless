const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ukaxo1ks19.execute-api.ap-southeast-1.amazonaws.com/production/users";

export interface Task {
  id: string;
  name: string;
  email: string;
  age: number;
}

export interface CreateTaskData {
  name: string;
  email: string;
  age: number;
}

export interface UpdateTaskData {
  name?: string;
  email?: string;
  age?: number;
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new ApiError(
      response.status,
      errorText || `Request failed with status ${response.status}`,
    );
  }

  // Some DELETE responses return no body
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text);
  } catch {
    return {} as T;
  }
}

export const taskApi = {
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse<Task[]>(response);
  },

  async create(data: CreateTaskData): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        age: Number(data.age),
      }),
    });
    return handleResponse<Task>(response);
  },

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await handleResponse<void>(response);
  },
};
