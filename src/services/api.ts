// API service for managing all backend routes and requests
const API_BASE_URL = '/api';

// Helper function to get auth headers (cookies will be sent automatically)
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

// Helper function to get auth headers for FormData (cookies will be sent automatically)
const getAuthHeadersFormData = () => ({});

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies in request
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  register: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    });
    return response;
  },

  resendOTP: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
      credentials: 'include',
    });
    return response;
  },

  getById: async (venueId: string) => {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
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
      credentials: 'include',
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
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });
    return response;
  },

  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  cancel: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  getAvailableSlots: async (venueId: string, courtId: string, date: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/available-slots?venueId=${venueId}&courtId=${courtId}&date=${date}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
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
      credentials: 'include',
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
      credentials: 'include',
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
      credentials: 'include',
      body: formData,
    });
    return response;
  },
};

// Reviews API endpoints
export const reviewsApi = {
  create: async (reviewData: {
    venueId: number;
    rating: number;
    comment: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(reviewData),
    });
    return response;
  },

  getByVenue: async (venueId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/venue/${venueId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },
};

// Admin API endpoints
export const adminApi = {
  login: async (adminId: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ adminId, password }),
    });
    return response;
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  getPendingFacilities: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/facilities/pending`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  approveFacility: async (facilityId: number, comments?: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/facilities/${facilityId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ comments }),
    });
    return response;
  },

  rejectFacility: async (facilityId: number, comments?: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/facilities/${facilityId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ comments }),
    });
    return response;
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  banUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  unbanUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },
};

// Facility Management API endpoints
export const facilityApi = {
  updateDetails: async (facilityData: {
    name: string;
    description: string;
    location: string;
    amenities: string[];
    sports: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/facility/details`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(facilityData),
    });
    return response;
  },

  uploadPhotos: async (photos: FormData) => {
    const response = await fetch(`${API_BASE_URL}/facility/photos`, {
      method: 'POST',
      headers: getAuthHeadersFormData(),
      credentials: 'include',
      body: photos,
    });
    return response;
  },

  addCourt: async (courtData: {
    name: string;
    sport: string;
    pricePerHour: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/facility/courts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(courtData),
    });
    return response;
  },

  updateCourt: async (courtId: number, courtData: {
    name: string;
    sport: string;
    pricePerHour: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/facility/courts/${courtId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(courtData),
    });
    return response;
  },

  deleteCourt: async (courtId: number) => {
    const response = await fetch(`${API_BASE_URL}/facility/courts/${courtId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  acceptBooking: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/facility/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response;
  },

  rejectBooking: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/facility/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
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