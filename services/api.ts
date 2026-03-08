const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

type LoginResponse = {
  token: string;
};

type RegisterRequest = {
  username: string;
  email?: string;
  password: string;
  phone?: string;
  user_type?: "CUSTOMER" | "SELLER";
};

export const authTokenKey = "token";

export const getAuthToken = () => localStorage.getItem(authTokenKey);

export const setAuthToken = (token: string) => {
  localStorage.setItem(authTokenKey, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(authTokenKey);
};

const formatErrorMessage = (data: unknown): string => {
  if (!data) return "Request failed";
  if (typeof data === "string") return data;
  if (typeof data !== "object") return "Request failed";

  const record = data as Record<string, unknown>;
  const nonFieldErrors = record.non_field_errors;
  if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
    return nonFieldErrors.join(" ");
  }

  const messages: string[] = [];
  for (const value of Object.values(record)) {
    if (Array.isArray(value)) {
      messages.push(value.join(" "));
    } else if (typeof value === "string") {
      messages.push(value);
    }
  }

  return messages.length > 0 ? messages.join(" ") : "Request failed";
};

const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = getAuthToken();
  const headers = new Headers(init?.headers);
  const isFormData = init?.body instanceof FormData;
  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Token ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      errorMessage = data?.error || formatErrorMessage(data);
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const resolveMediaUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${API_ORIGIN}${value}`;
  return `${API_ORIGIN}/${value}`;
};

export const authAPI = {
  login: (username: string, password: string) =>
    apiFetch<LoginResponse>("api-token-auth/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  register: (data: RegisterRequest) =>
    apiFetch("register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export type KitchenApi = {
  id: number;
  name: string;
  description: string;
  location: string;
  operating_hours: string;
  bank_details: string;
  gallery_notes: string;
  notification_enabled: boolean;
  cover_image: string | null;
  logo: string | null;
  rating: number | null;
  follower_count: number;
  is_following: boolean;
  is_active: boolean;
};

type FollowResponse = {
  status: "followed" | "unfollowed";
  follower_count: number;
};

export const kitchenAPI = {
  getAll: () => apiFetch<KitchenApi[]>("kitchens/"),
  getMine: () => apiFetch<KitchenApi>("kitchens/mine/"),
  updateMine: (
    data: Partial<
      Pick<
        KitchenApi,
        "name" | "description" | "location" | "is_active" | "operating_hours" | "bank_details" | "gallery_notes" | "notification_enabled"
      >
    > & {
      cover_image?: File | null;
      logo?: File | null;
    }
  ) => {
    const hasFile = data.cover_image instanceof File || data.logo instanceof File;
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (value instanceof File) {
          formData.append(key, value);
          return;
        }
        formData.append(key, String(value));
      });
      return apiFetch<KitchenApi>("kitchens/mine/", {
        method: "PATCH",
        body: formData,
      });
    }
    return apiFetch<KitchenApi>("kitchens/mine/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  follow: (id: string) =>
    apiFetch<FollowResponse>(`kitchens/${id}/follow/`, { method: "POST" }),
};

export type TodayMenuApi = {
  id: number;
  kitchen: number;
  is_active: boolean;
  expires_at: string;
  time_remaining?: string;
  items: MenuItemApi[];
};

export type MenuItemApi = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
  is_available: boolean;
};

export const menuAPI = {
  getByKitchen: (kitchenId: string) =>
    apiFetch<TodayMenuApi[]>(`menus/?kitchen_id=${kitchenId}`),
  createMenu: (data: { kitchen: number; expires_at: string; is_active: boolean }) =>
    apiFetch<TodayMenuApi>("menus/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  addMenuItem: (data: {
    today_menu: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    is_available: boolean;
    image?: File | null;
  }) =>
    (() => {
      const formData = new FormData();
      formData.append("today_menu", String(data.today_menu));
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("is_available", String(data.is_available));
      if (data.image) formData.append("image", data.image);
      return apiFetch<MenuItemApi>("menu-items/", {
        method: "POST",
        body: formData,
      });
    })(),
};

type CreateOrderRequest = {
  kitchen: number;
  today_menu: number;
  total_amount: number;
  pickup_time: string;
  delivery_address?: string;
  is_delivery: boolean;
  payment_method: "ONLINE" | "CASH";
  payment_status: boolean;
};

export type OrderItemCreate = {
  menu_item: number;
  quantity: number;
  price_at_time: number;
};

export const orderAPI = {
  create: (data: CreateOrderRequest) =>
    apiFetch("orders/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  list: () => apiFetch<OrderApi[]>("orders/"),
  listSeller: () => apiFetch<OrderApi[]>("orders/seller/"),
  updateStatus: (orderId: number, status: string) =>
    apiFetch(`orders/${orderId}/update_status/`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
  addItem: (orderId: number, item: OrderItemCreate) =>
    apiFetch(`order-items/`, {
      method: "POST",
      body: JSON.stringify({
        order: orderId,
        menu_item_id: item.menu_item,
        quantity: item.quantity,
        price_at_time: item.price_at_time,
      }),
    }),
};

export type OrderApi = {
  id: number;
  order_number: string;
  customer: number;
  customer_name?: string;
  today_menu: number;
  kitchen: number;
  kitchen_name: string;
  status: string;
  total_amount: number;
  pickup_time: string;
  delivery_address: string;
  is_delivery: boolean;
  payment_method: string;
  payment_status: boolean;
  items?: OrderItemApi[];
  created_at: string;
};

export type OrderItemApi = {
  id: number;
  quantity: number;
  price_at_time: number;
  menu_item?: {
    id: number;
    name: string;
  };
};
