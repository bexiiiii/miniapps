"use client";

import * as React from "react";
import { apiClient, type Cart, type CartItem as BackendCartItem } from "~/lib/api-client";
import { useAuth } from "~/lib/auth-context";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

// Frontend cart item interface (compatible with existing components)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  storeId?: string;
}

export interface CartContextType {
  addItem: (productId: number, quantity?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  items: CartItem[];
  removeItem: (itemId: number) => Promise<void>;
  subtotal: number;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/*                                Context                                     */
/* -------------------------------------------------------------------------- */

const CartContext = React.createContext<CartContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                               Provider                                     */
/* -------------------------------------------------------------------------- */

export function CartBackendProvider({ children }: React.PropsWithChildren) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = React.useState<Cart | null>(null);
  const [convertedItems, setConvertedItems] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Convert backend cart item to frontend format
  const convertCartItem = async (backendItem: BackendCartItem): Promise<CartItem> => {
    let storeId = backendItem.storeId?.toString();
    
    // If storeId is not available in cart item, try to get it from product details
    if (!storeId && backendItem.productId) {
      try {
        console.log('Cart: Getting product details for productId:', backendItem.productId);
        const productDetails = await apiClient.getProductById(backendItem.productId);
        storeId = productDetails.storeId.toString();
        console.log('Cart: Found storeId from product:', storeId);
      } catch (error) {
        console.warn('Cart: Failed to get product details:', error);
      }
    }
    
    return {
      id: backendItem.id?.toString() || backendItem.productId.toString(),
      name: backendItem.productName || 'Unknown Product',
      price: backendItem.price || 0,
      quantity: backendItem.quantity,
      image: backendItem.productImages?.[0] || '/placeholder-food.jpg',
      category: 'Food', // Default category since backend doesn't provide it in cart item
      storeId: storeId
    };
  };

  // Load cart from backend
  const refreshCart = React.useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCart(null);
      setConvertedItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const cartData = await apiClient.getCart();
      setCart(cartData);
      
      // Convert cart items asynchronously
      if (cartData.items && cartData.items.length > 0) {
        const convertedCartItems = await Promise.all(
          cartData.items.map(item => convertCartItem(item))
        );
        setConvertedItems(convertedCartItems);
      } else {
        setConvertedItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
      setCart(null);
      setConvertedItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Load cart on mount and when auth status changes
  React.useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /* ----------------------------- Actions -------------------------------- */
  const addItem = React.useCallback(
    async (productId: number, quantity = 1) => {
      if (!isAuthenticated) {
        setError('Please log in to add items to cart');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const updatedCart = await apiClient.addItemToCart(productId, quantity);
        setCart(updatedCart);
        
        // Update converted items
        if (updatedCart.items && updatedCart.items.length > 0) {
          const convertedCartItems = await Promise.all(
            updatedCart.items.map(item => convertCartItem(item))
          );
          setConvertedItems(convertedCartItems);
        } else {
          setConvertedItems([]);
        }
      } catch (err) {
        console.error('Error adding item to cart:', err);
        setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  const removeItem = React.useCallback(async (itemId: number) => {
    if (!isAuthenticated) {
      setError('Please log in to modify cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await apiClient.removeCartItem(itemId);
      setCart(updatedCart);
      
      // Update converted items
      if (updatedCart.items && updatedCart.items.length > 0) {
        const convertedCartItems = await Promise.all(
          updatedCart.items.map(item => convertCartItem(item))
        );
        setConvertedItems(convertedCartItems);
      } else {
        setConvertedItems([]);
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateQuantity = React.useCallback(async (itemId: number, quantity: number) => {
    if (!isAuthenticated) {
      setError('Please log in to modify cart');
      return;
    }

    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await apiClient.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      
      // Update converted items
      if (updatedCart.items && updatedCart.items.length > 0) {
        const convertedCartItems = await Promise.all(
          updatedCart.items.map(item => convertCartItem(item))
        );
        setConvertedItems(convertedCartItems);
      } else {
        setConvertedItems([]);
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, removeItem]);

  const clearCart = React.useCallback(async () => {
    if (!isAuthenticated) {
      setError('Please log in to clear cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clearedCart = await apiClient.clearCart();
      setCart(clearedCart);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /* --------------------------- Derived data ----------------------------- */
  const items = convertedItems;

  const itemCount = React.useMemo(
    () => cart?.itemCount || 0,
    [cart?.itemCount],
  );

  const subtotal = React.useMemo(
    () => cart?.subtotal || 0,
    [cart?.subtotal],
  );

  /* ----------------------------- Context value -------------------------- */
  const value = React.useMemo<CartContextType>(
    () => ({
      addItem,
      clearCart,
      itemCount,
      items,
      removeItem,
      subtotal,
      updateQuantity,
      loading,
      error,
      refreshCart,
    }),
    [
      addItem,
      clearCart,
      itemCount,
      items,
      removeItem,
      subtotal,
      updateQuantity,
      loading,
      error,
      refreshCart,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

/* -------------------------------------------------------------------------- */
/*                                 Hook                                      */
/* -------------------------------------------------------------------------- */

export function useCartBackend(): CartContextType {
  const ctx = React.use(CartContext);
  if (!ctx) throw new Error("useCartBackend must be used within a CartBackendProvider");
  return ctx;
}
