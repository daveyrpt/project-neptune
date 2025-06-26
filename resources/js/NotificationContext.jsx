import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openNotification = () => setIsOpen(true);
    const closeNotification = () => setIsOpen(false);

    return (
        <NotificationContext.Provider value={{ isOpen, openNotification, closeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
