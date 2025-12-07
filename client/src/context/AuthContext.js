import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is already logged in on App Load
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                // Optional: Verify token with backend here if needed
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    // 2. Login Function
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // 3. Logout Function (The Missing Piece)
    const logout = () => {
        // Clear all local storage items
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Reset State
        setUser(null);
        // Redirect is handled in the UI component usually, 
        // but state change triggers re-render
    };

    // 4. Role Checker
    // Returns true if user is Owner, false otherwise
    const isOwner = () => {
        return user?.role === 'owner';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isOwner, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;