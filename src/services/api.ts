// API service for managing all backend routes and requests
const API_BASE_URL = '/api';

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
});

// Helper function to get auth headers for FormData
const getAuthHeadersFormData = () => ({
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
});

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  register: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData,
    });
    return response;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return response;
  },

  resendOTP: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response;
  },
};

// Venues API endpoints
export const venuesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },

  getById: async (venueId: string) => {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },

  search: async (params: { sport?: string; location?: string; date?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.sport) searchParams.append('sport', params.sport);
    if (params.location) searchParams.append('location', params.location);
    if (params.date) searchParams.append('date', params.date);

    const response = await fetch(`${API_BASE_URL}/venues/search?${searchParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },
};

// Bookings API endpoints
export const bookingsApi = {
  create: async (bookingData: {
    venueId: number;
    courtId: number;
    date: string;
    timeSlot: string;
    duration: number;
    totalAmount: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    return response;
  },

  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },

  cancel: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return response;
  },

  getAvailableSlots: async (venueId: string, courtId: string, date: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/available-slots?venueId=${venueId}&courtId=${courtId}&date=${date}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },
};

// User API endpoints
export const userApi = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  },

  updateProfile: async (profileData: {
    name: string;
    email: string;
    phone: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return response;
  },

  uploadAvatar: async (avatarFile: File) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await fetch(`${API_BASE_URL}/user/avatar`, {
      method: 'POST',
      headers: getAuthHeadersFormData(),
      body: formData,
    });
    return response;
  },
};

// Error handling helper
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Success response helper
export const handleApiSuccess = async (response: Response) => {
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Request failed');
  }
};