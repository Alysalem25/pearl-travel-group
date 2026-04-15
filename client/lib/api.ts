/**
 * Secure API Client
 * Axios instance with JWT interceptors and error handling
 * 
 * Security Features:
 * - Automatically adds Authorization header with JWT
 * - Handles 401/403 errors (redirect to login)
 * - Centralized error handling
 * - Token refresh support (can be extended)
 * - Type-safe requests
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAuthToken, clearAuthData } from "./auth";


type CategoryPayload = {
  nameEn: string
  nameAr: string
  type: string
  country: string
  images: string
  isActive: boolean
}

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Request Interceptor
 * Automatically add JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle authentication errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      clearAuthData();

      // Only redirect in client-side (not during SSR)
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }

      return Promise.reject({
        ...error,
        message: "Session expired. Please log in again."
      });
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      return Promise.reject({
        ...error,
        message: "You don't have permission to access this resource."
      });
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject({
        ...error,
        message: "Resource not found."
      });
    }

    // Handle 400 Bad Request (validation errors)
    if (error.response?.status === 400) {
      const data = error.response.data as any;
      return Promise.reject({
        ...error,
        message: data?.error || "Invalid request."
      });
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      return Promise.reject({
        ...error,
        message: "Server error. Please try again later."
      });
    }

    // Network error or timeout
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: "Network error. Please check your connection."
      });
    }

    return Promise.reject(error);
  }
);

/**
 * API Methods with proper typing
 */
export const api = {
  /**
   * Authentication endpoints
   */
  auth: {
    register: (data: FormData | { name: string; email: string; password: string; number: string }) =>
      apiClient.post("/auth/register", data, {
        headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
      }),

    login: (data: { email: string; password: string }) =>
      apiClient.post("/auth/login", data),

    me: () => apiClient.get("/auth/me"),

    team: () => apiClient.get("/auth/team")
  },
  visa: {
    getAll: () => apiClient.get("/visa"),
    // ... other visa methods
  },
  /**
   * Category endpoints
   */
  categories: {
    getAll: () => apiClient.get("/categories"),

    getOne: (id: string) => apiClient.get(`/categories/${id}`),

    create: (data: FormData) =>
      apiClient.post("/categories", data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),
    update: (id: string, data: FormData | any) => {
      const isFormData = data instanceof FormData;
      return apiClient.put(`/categories/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
      });
    },

    delete: (id: string) =>
      apiClient.delete(`/categories/${id}`),

    addImages: (id: string, files: FormData) =>
      apiClient.post(`/categories/${id}/images`, files, {
        headers: { "Content-Type": "multipart/form-data" }
      }),

    // categories/country/${countryName}
    // get categories by country name
    getCategoryByCountry: (countryName: string) =>
      apiClient.get(`/categories/country/${countryName}`),

    deleteImage: (id: string, imageName: string) =>
      apiClient.delete(`/categories/${id}/images/${imageName}`)
  },

  /**
   * Program endpoints
   */
  // programs: {
  //   getAll: () => apiClient.get("/programs"),

  //   getOne: (id: string) => apiClient.get(`/programs/${id}`),

  //   create: (data: FormData) =>
  //     apiClient.post("/programs", data, {
  //       headers: { "Content-Type": "multipart/form-data" }
  //     }),

  //   getProgamsByCategory: (categoryId: string) =>
  //     apiClient.get(`/programs/category/${categoryId}`),

  //   update: (id: string, data: any) =>
  //     apiClient.put(`/programs/${id}`, data),

  //   delete: (id: string) =>
  //     apiClient.delete(`/programs/${id}`),

  //   addImages: (id: string, files: FormData) =>
  //     apiClient.post(`/programs/${id}/images`, files, {
  //       headers: { "Content-Type": "multipart/form-data" }
  //     })
  // },

  // countries endpoints

  programs: {
    getAll: () => apiClient.get("/programs"),

    getOne: (id: string) => apiClient.get(`/programs/${id}`),

    create: (data: FormData) =>
      apiClient.post("/programs", data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),

    getProgamsByCategory: (categoryId: string) =>
      apiClient.get(`/programs/category/${categoryId}`),

    deleteImage: (programId: string, imageName: string) =>
      apiClient.delete(`/programs/${programId}/images/${imageName}`),

    // FIXED: Support FormData for image uploads on update
    update: (id: string, data: FormData | any) => {
      const isFormData = data instanceof FormData;
      return apiClient.put(`/programs/${id}`, data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined
      });
    },

    delete: (id: string) =>
      apiClient.delete(`/programs/${id}`),

    addImages: (id: string, files: FormData) =>
      apiClient.post(`/programs/${id}/images`, files, {
        headers: { "Content-Type": "multipart/form-data" }
      })
  },

  countries: {
    getAll: () => apiClient.get("/countries"),
    getInVisa: () => apiClient.get("/countries/inVisa"),
    getOne: (id: string) => apiClient.get(`/countries/${id}`),
    create: (data: FormData) =>
      apiClient.post("/countries", data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),
    update: (id: string, data: FormData | any) => {
      const isFormData = data instanceof FormData;
      return apiClient.put(`/countries/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
      });
    },
    delete: (id: string) =>
      apiClient.delete(`/countries/${id}`),
    addImages: (id: string, files: FormData) =>
      apiClient.post(`/countries/${id}/images`, files, {
        headers: { "Content-Type": "multipart/form-data" }
      })
  },

  // flights endpoints
  flights: {
    create: (data: { userEmail: string; userName?: string; userNumber?: number; from: string; to: string }) =>
      apiClient.post("/flights", data),
    getAll: () => apiClient.get("/flights"),
    delete: (id: string) => apiClient.delete(`/flights/${id}`),
    changeStatus: (id: string, status: string) => apiClient.put(`/flights/${id}/status`, { status })
  },

  // booked programs endpoints
  bookings: {
    create: (data: { userEmail: string; userName: string; userNumber: string; message: string; programId: string }) =>
      apiClient.post("/programs/book", data),
    getAll: () => apiClient.get("/programs/booked"),
    delete: (id: string) => apiClient.delete(`/programs/booked/${id}`),
    changeStatus: (id: string, status: string,) => apiClient.put(`/programs/booked/${id}/status`, { status })
  },

  // car trips endpoints
  carTrips: {
    create: (data: { userEmail: string; userName: string; userNumber: string; message: string; carId: string }) =>
      apiClient.post("/carTrip", data),
    getAll: () => apiClient.get("/carTrip"),
    delete: (id: string) => apiClient.delete(`/carTrip/${id}`),
    changeStatus: (id: string, status: string) => apiClient.put(`/carTrip/${id}/status`, { status })
  },

  // hotel endpoints
  hotelBooking: {
    create: (data: { userEmail: string; userName: string; userNumber: string; message: string; hotelId: string }) =>
      apiClient.post("/hotelBooking", data),
    getAll: () => apiClient.get("/hotelBooking"),
    delete: (id: string) => apiClient.delete(`/hotelBooking/${id}`),
    changeStatus: (id: string, status: string, reviewedBy?: string) =>
      apiClient.put(`/hotelBooking/${id}/status`, { status, reviewedBy })
  },

  // cruisies endpoints
  cruisies: {
    getAll: () => apiClient.get("/cruisies"),
    getOne: (id: string) => apiClient.get(`/cruisies/${id}`),
    create: (data: FormData) =>
      apiClient.post("/cruisies", data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),
    update: (id: string, data: FormData | any) => {
      const isFormData = data instanceof FormData;
      return apiClient.put(`/cruisies/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
      });
    },
    delete: (id: string) =>
      apiClient.delete(`/cruisies/${id}`),
    addImages: (id: string, files: FormData) =>
      apiClient.post(`/cruisies/${id}/images`, files, {
        headers: { "Content-Type": "multipart/form-data" }
      }),
    deleteImage: (id: string, imageName: string) =>
      apiClient.delete(`/cruisies/${id}/images/${imageName}`),
    book: (data: { userEmail: string; userName: string; userNumber: string; message: string; cruiseId: string }) =>
      apiClient.post("/cruisies/book", data),
    getAllBooked: () => apiClient.get("/cruisies/book"),
    deleteBooked: (id: string) => apiClient.delete(`/cruisies/book/${id}`),
    changeStatusBooked: (id: string, status: string) => apiClient.put(`/cruisies/book/${id}/status`, { status })
  },
  /**
   * Event endpoints
   */
  events: {
    getAll: (params?: { category?: string; country?: string; status?: string; featured?: boolean; upcoming?: boolean }) =>
      apiClient.get("/events", { params }),

    getFeatured: () => apiClient.get("/events/featured"),

    getByCategory: (categoryId: string, country?: string) =>
      apiClient.get(`/events/category/${categoryId}`, { params: country ? { country } : {} }),

    getOne: (id: string) => apiClient.get(`/events/${id}`),

    create: (data: FormData) =>
      apiClient.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),

    update: (id: string, data: FormData) =>
      apiClient.put(`/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),

    delete: (id: string) => apiClient.delete(`/events/${id}`),

    deleteImage: (eventId: string, imageName: string) =>
      apiClient.delete(`/events/${eventId}/images/${imageName}`)
  },
  /**
   * Stats endpoint
   */
  getStats: () => apiClient.get("/stats"),


  users: {
    // Existing methods...
    getSummary: (id: string, start?: string, end?: string) =>
      apiClient.get(`/users/${id}/summary`, {
        params: { ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),
    getOne: (id: string) => apiClient.get(`/users/${id}`),

    // Get reviewed bookings for a user
    getReviewedFlights: (userId: string, start?: string, end?: string) =>
      apiClient.get(`/users/reviewed/flights`, {
        params: { userId, ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),
    getReviewedHotels: (userId: string, start?: string, end?: string) =>
      apiClient.get(`/users/reviewed/hotels`, {
        params: { userId, ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),
    getReviewedCarTrips: (userId: string, start?: string, end?: string) =>
      apiClient.get(`/users/reviewed/cartrips`, {
        params: { userId, ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),
    getReviewedVisa: (userId: string, start?: string, end?: string) =>
      apiClient.get(`/users/reviewed/visa`, {
        params: { userId, ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),
    getReviewedPrograms: (userId: string, start?: string, end?: string) =>
      apiClient.get(`/users/reviewed/programs`, {
        params: { userId, ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),
    getReviewedCruises: (userId: string, start?: string, end?: string) =>
      apiClient.get(`/users/reviewed/cruises`, {
        params: { userId, ...(start ? { start } : {}), ...(end ? { end } : {}) }
      }),

    // New Profile methods
    getProfile: (id: string) => apiClient.get(`/auth/profile/${id}`),

    updateProfile: (id: string, data: FormData) =>
      apiClient.put(`/auth/profile/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      }),

    deleteImage: (id: string, imageName: string) =>
      apiClient.delete(`/auth/profile/${id}/images/${imageName}`),

    changePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
      apiClient.put(`/auth/profile/${id}/password`, data)
  }
};

export default apiClient;
