// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface AuthRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryId: number;
  categoryName: string;
  storeId: number;
  storeName: string;
  storeLogo?: string;
  storeAddress?: string;
  status: string;
  active: boolean;
  discountPercentage?: number;
  stockQuantity: number;
  expiryDate: string;
  orderCount?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  // Computed properties for backward compatibility
  imageUrl: string;
  availableQuantity: number;
  expirationDate: string;
  isAvailable: boolean;
  isFeatured: boolean;
  rating?: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

interface CartItem {
  id?: number;
  cartId?: number;
  productId: number;
  productName?: string;
  productImages?: string[];
  quantity: number;
  price?: number;
  discountPrice?: number;
  subtotal?: number;
  discount?: number;
  total?: number;
  storeId?: number;
  storeName?: string;
}

interface Cart {
  id?: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  items: CartItem[];
  itemCount?: number;
  subtotal?: number;
  totalDiscount?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  openingHours?: string;
  closingHours?: string;
  // Detailed working hours
  workingHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
  // Simplified working hours string (fallback)
  workingHoursText?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  status?: string;
  active?: boolean;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  paymentMethod: 'CASH' | 'CARD';
  comment?: string;
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerId?: number;
  customerName: string;
  customerPhone: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'CARD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  items: OrderItem[];
  subtotal: number;
  total: number;
  comment?: string;
  pickupTime?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = localStorage.getItem('authToken');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - but don't redirect immediately
    // Let the calling component handle the error instead
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Don't redirect automatically - let the auth context handle it
      console.warn('Authentication failed - tokens cleared');
    }

    return response;
  }

  // Helper method for public requests (no auth required)
  private async fetchPublic(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  }

  // Auth methods
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json() as AuthResponse;
    
    // Store tokens
    localStorage.setItem('authToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json() as AuthResponse;
    
    // Store tokens
    localStorage.setItem('authToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.fetchWithAuth('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Product methods
  async getProducts(page: number = 0, size: number = 20): Promise<PaginatedResponse<Product>> {
    const response = await this.fetchPublic(`/products?page=${page}&size=${size}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json() as Promise<PaginatedResponse<Product>>;
  }

  async getFeaturedProducts(page: number = 0, size: number = 8): Promise<PaginatedResponse<Product>> {
    const response = await this.fetchPublic(`/products/featured?page=${page}&size=${size}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }

    return response.json() as Promise<PaginatedResponse<Product>>;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.fetchPublic(`/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json() as Promise<Product>;
  }

  async searchProducts(query: string, page: number = 0, size: number = 20): Promise<PaginatedResponse<Product>> {
    const response = await this.fetchPublic(`/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }

    return response.json() as Promise<PaginatedResponse<Product>>;
  }

  async getProductsByCategory(categoryId: number, page: number = 0, size: number = 20): Promise<PaginatedResponse<Product>> {
    const response = await this.fetchPublic(`/products/category/${categoryId}?page=${page}&size=${size}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }

    return response.json() as Promise<PaginatedResponse<Product>>;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.fetchPublic('/categories/active');
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json() as Promise<Category[]>;
  }

  // Cart methods
  async getCart(): Promise<Cart> {
    const response = await this.fetchWithAuth('/cart');
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return response.json() as Promise<Cart>;
  }

  async addItemToCart(productId: number, quantity: number = 1): Promise<Cart> {
    const response = await this.fetchWithAuth('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        quantity
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return response.json() as Promise<Cart>;
  }

  async updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    const response = await this.fetchWithAuth(`/cart/items/${itemId}?quantity=${quantity}`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return response.json() as Promise<Cart>;
  }

  async removeCartItem(itemId: number): Promise<Cart> {
    const response = await this.fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove cart item');
    }

    return response.json() as Promise<Cart>;
  }

  async clearCart(): Promise<Cart> {
    const response = await this.fetchWithAuth('/cart', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return response.json() as Promise<Cart>;
  }

  async getCartItemCount(): Promise<number> {
    const response = await this.fetchWithAuth('/cart/count');
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart item count');
    }

    return response.json() as Promise<number>;
  }

  async getCartTotal(): Promise<number> {
    const response = await this.fetchWithAuth('/cart/total');
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart total');
    }

    return response.json() as Promise<number>;
  }

  // Store methods
  async getStoreById(id: number): Promise<StoreInfo> {
    const response = await this.fetchPublic(`/stores/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch store');
    }

    return response.json() as Promise<StoreInfo>;
  }

  // Order methods
  async createOrderFromCart(orderData: CreateOrderRequest): Promise<Order> {
    // First get the current cart
    const cart = await this.getCart();
    
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Create OrderDTO structure that matches backend expectations
    const orderDTO = {
      contactPhone: orderData.customerPhone,
      paymentMethod: orderData.paymentMethod,
      deliveryNotes: orderData.comment,
      deliveryAddress: orderData.deliveryAddress,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    const response = await this.fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderDTO),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData.message || 'Failed to create order');
    }

    return response.json() as Promise<Order>;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData.message || 'Failed to create order');
    }

    return response.json() as Promise<Order>;
  }

  async getOrder(orderId: number): Promise<Order> {
    const response = await this.fetchWithAuth(`/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json() as Promise<Order>;
  }

  async getUserOrders(): Promise<Order[]> {
    const response = await this.fetchWithAuth('/orders/my-orders');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }

    return response.json() as Promise<Order[]>;
  }

  // User profile methods
  async getUserProfile(): Promise<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    role: string;
  }> {
    const response = await this.fetchWithAuth('/users/profile');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json() as Promise<{
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      address?: string;
      role: string;
    }>;
  }
}

// Debug: log the apiClient methods
console.log('ApiClient methods:', Object.getOwnPropertyNames(ApiClient.prototype));

export const apiClient = new ApiClient();
export type { 
  AuthRequest, 
  RegisterRequest, 
  AuthResponse, 
  Product, 
  PaginatedResponse, 
  Cart, 
  CartItem, 
  StoreInfo,
  Category,
  CreateOrderRequest,
  Order,
  OrderItem
};