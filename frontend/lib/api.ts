const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export const apiGet = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json();
};

export const apiPost = async <T>(path: string, body: any): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`POST ${path} failed: ${res.status}`);
  }
  return res.json();
};

export const buildQuery = (params: Record<string, string | number | undefined | null>) => {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qp.set(key, String(value));
    }
  });
  return qp.toString();
};
