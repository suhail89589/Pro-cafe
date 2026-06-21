/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../config";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart from backend when token loads/changes, otherwise load from localStorage
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            const mappedItems = data.items.map(item => {
              // Gracefully handle unpopulated references if any
              const food = item.foodId || {};
              return {
                id: food._id || item._id,
                name: food.name || "Unknown Item",
                price: food.price || 0,
                image: food.image || "",
                category: food.category || "",
                quantity: item.quantity,
              };
            });
            setCart(mappedItems);
          }
        } catch (error) {
          console.error('Failed to fetch cart from backend', error);
        }
      } else {
        try {
          const savedCart = localStorage.getItem("procafe_cart");
          setCart(savedCart ? JSON.parse(savedCart) : []);
        } catch {
          setCart([]);
        }
      }
    };

    fetchCart();
  }, [token]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!token) {
      localStorage.setItem("procafe_cart", JSON.stringify(cart));
    }
  }, [cart, token]);

  // Create
  const addToCart = async (product) => {
    const productId = product.id || product._id;
    let success = false;

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            foodId: productId,
            quantity: 1,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const mappedItems = data.items.map(item => {
            const food = item.foodId || {};
            return {
              id: food._id || item._id,
              name: food.name || "Unknown Item",
              price: food.price || 0,
              image: food.image || "",
              category: food.category || "",
              quantity: item.quantity,
            };
          });
          setCart(mappedItems);
          success = true;
        }
      } catch (error) {
        console.error('Error adding to cart on backend, falling back to local cart', error);
      }
    }

    if (!success) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...product, id: productId, quantity: 1 }];
      });
    }
    // Open drawer as dynamic interactive feedback
    setIsCartOpen(true);
  };

  // Update
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    let success = false;

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            foodId: id,
            quantity: newQuantity,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const mappedItems = data.items.map(item => {
            const food = item.foodId || {};
            return {
              id: food._id || item._id,
              name: food.name || "Unknown Item",
              price: food.price || 0,
              image: food.image || "",
              category: food.category || "",
              quantity: item.quantity,
            };
          });
          setCart(mappedItems);
          success = true;
        }
      } catch (error) {
        console.error('Error updating quantity on backend, falling back to local', error);
      }
    }

    if (!success) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Delete
  const removeFromCart = async (id) => {
    let success = false;

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/remove/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedItems = data.items.map(item => {
            const food = item.foodId || {};
            return {
              id: food._id || item._id,
              name: food.name || "Unknown Item",
              price: food.price || 0,
              image: food.image || "",
              category: food.category || "",
              quantity: item.quantity,
            };
          });
          setCart(mappedItems);
          success = true;
        }
      } catch (error) {
        console.error('Error removing from cart on backend, falling back to local', error);
      }
    }

    if (!success) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }
  };

  // Clear
  const clearCart = async () => {
    let success = false;

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setCart([]);
          success = true;
        }
      } catch (error) {
        console.error('Error clearing cart on backend, falling back to local', error);
      }
    }

    if (!success) {
      setCart([]);
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
