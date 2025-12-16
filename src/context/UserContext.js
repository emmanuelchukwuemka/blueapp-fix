import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        profileImage: null, // URI string
        isLoggedIn: false
    });

    const updateUser = (newData) => {
        setUser((prev) => ({ ...prev, ...newData }));
    };

    const login = (name) => {
        setUser((prev) => ({ ...prev, name, isLoggedIn: true }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser, login }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
