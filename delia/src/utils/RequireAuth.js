import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function RequireAuth({ children }) {
    const location = useLocation(); 
    const [ user, setUser] = useUser();

    if (!user.token) {
        return <Navigate to={"/login"} state={{ from: location }} replace={true}/>;
    }
    return children;
}
