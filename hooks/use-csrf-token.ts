import { useState, useEffect } from 'react';

interface CSRFTokenState {
  token: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to manage CSRF tokens for API requests
 * Automatically fetches and refreshes CSRF tokens
 */
export function useCSRFToken(): CSRFTokenState {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json();
      setToken(data.csrfToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching CSRF token:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return {
    token,
    loading,
    error,
    refresh: fetchToken,
  };
}

/**
 * Helper function to add CSRF token to fetch requests
 * @param token - The CSRF token
 * @param options - Fetch options
 * @returns Updated fetch options with CSRF token
 */
export function withCSRFToken(token: string | null, options: RequestInit = {}): RequestInit {
  if (!token) {
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': token,
    },
  };
}
