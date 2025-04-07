import React, { createContext, useReducer } from 'react';

export const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.payload, showMessage: true };
    case 'CLEAR_MESSAGE':
      return { ...state, message: '', showMessage: false };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    message: '',
    showMessage: false
  });

  const setMessage = (message) => {
    dispatch({ type: 'SET_MESSAGE', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 5000);
  };

  const clearMessage = () => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  };

  return (
    <NotificationContext.Provider value={{ state, setMessage, clearMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};
