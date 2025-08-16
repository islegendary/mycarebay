import { Senior } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  plan: string;
}

export interface SaveSeniorResponse {
  success: boolean;
  seniorId: string;
  message: string;
}

export interface DeleteSeniorResponse {
  success: boolean;
  message: string;
}

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request:', url, options.method || 'GET');

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP error! status: ${response.status}` };
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User authentication
  static async login(email: string, name: string, plan: string = 'free'): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, name, plan }),
    });
  }

  // Senior management
  static async getSeniors(userId: string): Promise<Senior[]> {
    return this.makeRequest<Senior[]>(`/seniors/user?userId=${userId}`);
  }

  static async saveSenior(userId: string, senior: Senior): Promise<SaveSeniorResponse> {
    return this.makeRequest<SaveSeniorResponse>('/seniors', {
      method: 'POST',
      body: JSON.stringify({ userId, senior }),
    });
  }

  static async deleteSenior(seniorId: string, userId: string): Promise<DeleteSeniorResponse> {
    return this.makeRequest<DeleteSeniorResponse>(`/seniors/delete?seniorId=${seniorId}&userId=${userId}`, {
      method: 'DELETE',
    });
  }
}

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Loading state management
export const createLoadingState = () => {
  let loading = false;
  let error: string | null = null;

  return {
    get loading() { return loading; },
    get error() { return error; },
    setLoading: (isLoading: boolean) => { loading = isLoading; },
    setError: (err: string | null) => { error = err; },
    reset: () => { loading = false; error = null; }
  };
};
