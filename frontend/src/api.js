const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    credentials: "include",
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  base: API_BASE,
  login() {
    window.location.href = API_BASE + "/api/auth/login";
  },
  logout() {
    return request("/api/auth/logout", { method: "POST" });
  },
  me() {
    return request("/api/me");
  },
  images(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") query.set(key, value);
    });
    return request("/api/images?" + query.toString());
  },
  upload(file, { tags = "", collectionId = "" } = {}) {
    const form = new FormData();
    form.append("image", file);
    if (tags) form.append("tags", tags);
    if (collectionId) form.append("collectionId", collectionId);
    return request("/api/images/upload", { method: "POST", body: form });
  },
  updateImage(id, payload) {
    return request("/api/images/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },
  deleteImage(id) {
    return request("/api/images/" + id, { method: "DELETE" });
  },
  collections() {
    return request("/api/collections");
  },
  createCollection(payload) {
    return request("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },
  deleteCollection(id) {
    return request("/api/collections/" + id, { method: "DELETE" });
  }
};