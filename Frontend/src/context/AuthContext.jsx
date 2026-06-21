/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('procafe_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('procafe_token') || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on load to verify user
    const checkUserSession = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            localStorage.setItem('procafe_user', JSON.stringify(data));
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      }
      setLoading(false);
    };

    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setToken(data.accessToken);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role,
    });
    localStorage.setItem('procafe_token', data.accessToken);
    localStorage.setItem('procafe_user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role,
    }));
    return data;
  };

  const signup = async (name, email, password, phone, address) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, address }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    setToken(data.accessToken);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role,
    });
    localStorage.setItem('procafe_token', data.accessToken);
    localStorage.setItem('procafe_user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role,
    }));
    return data;
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('procafe_token');
      localStorage.removeItem('procafe_user');
      // Clear cart local storage as well on logout
      localStorage.removeItem('procafe_cart');
    }
  };

  const updateProfile = async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Profile update failed');
    }

    setUser(data);
    localStorage.setItem('procafe_user', JSON.stringify(data));
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
