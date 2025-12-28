import React, { createContext, useState, useContext } from 'react';
import apiService from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateUser = (newData) => {
        setUser((prev) => ({ ...prev, ...newData }));
    };

    const login = (userData) => {
        setUser({ ...userData, isLoggedIn: true });
    };
    
    const logout = async () => {
        setUser(null);
        await apiService.removeToken();
    };
    
    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            const token = await apiService.getToken();
            if (token) {
                const response = await apiService.getProfile();
                setUser({ ...response.user, isLoggedIn: true });
            }
        } catch (error) {
            // Token might be invalid, clear it
            await apiService.removeToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser, login, logout, checkAuthStatus, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
