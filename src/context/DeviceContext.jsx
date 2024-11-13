'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const DeviceContext = createContext();

const DeviceProvider = ({ children }) => {
    const [deviceType, setDeviceType] = useState('PC');

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
        if (/android/i.test(userAgent) || 
            (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) || 
            (/Windows/.test(userAgent) && 'ontouchstart' in window)) {
            setDeviceType('Mobile');
        } else {
            setDeviceType('PC');
        }
    }, []); 
    
    const data = { deviceType };

    return (
        <DeviceContext.Provider value={data}>
            {children}
        </DeviceContext.Provider>
    );
};

const useDevice = () => useContext(DeviceContext);

export { DeviceProvider, useDevice };
export default DeviceContext;
