const API_URL = process.env.REACT_APP_API_URL || 'https://note-taking-1-fw49.onrender.com/api/auth';

// Helper function to decode JWT
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    } catch (error) {
        throw error;
    }
};

const verifyOtp = async ({ email, otp }) => {
    const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'OTP verification failed');
    return data;
};

const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        // Store both token and decoded user data
        if (data.token) {
            localStorage.setItem('token', data.token);
            const decodedUser = data.user;
            localStorage.setItem('user', JSON.stringify(decodedUser));
        }
        return data;
    } catch (error) {
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const getUser = async () => {
    try {
        const user = localStorage.getItem('user');
        return user;
    } catch (error) {
        throw error;
    }
};


const authService = { login, logout, isAuthenticated, register, verifyOtp, getUser };
export default authService;