// import React, { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const existingProduct = prev.find(item => item._id === product._id);
//       if (existingProduct) {
//         return prev.map(item =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (_id, amount) => {
//     setCart((prev) =>
//       prev
//         .map(item =>
//           item._id === _id
//             ? { ...item, quantity: item.quantity + amount }
//             : item
//         )
//         .filter(item => item.quantity > 0)
//     );
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, updateQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };




import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Initialize from localStorage
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // 2. Save to localStorage on every cart change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingProduct = prev.find(item => item._id === product._id);
      if (existingProduct) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (_id, amount) => {
    setCart((prev) =>
      prev
        .map(item =>
          item._id === _id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};