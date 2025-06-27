"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Package, QrCode, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useAuth } from "~/lib/auth-context";
import { apiClient, type Order as ApiOrder, type OrderItem as ApiOrderItem, type StoreInfo } from "~/lib/api-client";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { Skeleton } from "~/ui/primitives/skeleton";
import { Separator } from "~/ui/primitives/separator";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  categoryName?: string;
}

interface Order {
  id: string;
  orderNumber?: string;
  status: string;
  total: number;
  items: OrderItem[];
  contactPhone?: string;
  paymentMethod: string;
  createdAt: string;
  deliveryNotes?: string;
  userName?: string;
  userEmail?: string;
  storeName?: string;
  storeAddress?: string;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [storeInfoCache, setStoreInfoCache] = useState<Record<string, StoreInfo>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/sign-in");
      return;
    }
    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  // Function to get store information with caching
  const getStoreInfo = async (storeId: number): Promise<{ name: string; address: string }> => {
    const storeIdStr = storeId.toString();
    
    // Check cache first
    if (storeInfoCache[storeIdStr]) {
      const store = storeInfoCache[storeIdStr];
      return { name: store.name, address: store.address };
    }

    try {
      const storeInfo = await apiClient.getStoreById(storeId);
      
      // Update cache
      setStoreInfoCache(prev => ({
        ...prev,
        [storeIdStr]: storeInfo
      }));
      
      return { name: storeInfo.name, address: storeInfo.address };
    } catch (error) {
      console.warn(`Failed to fetch store info for store ${storeId}:`, error);
      // Return default store info if API fails
      return { 
        name: "FoodSave Store", 
        address: "г. Алматы, ул. Абая, 123" 
      };
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Try to get orders from API
      try {
        const apiOrders = await apiClient.getUserOrders();
        
        // Transform orders with store information
        const transformedOrders: Order[] = await Promise.all(
          apiOrders.map(async (order: ApiOrder) => {
            // Get store info dynamically from backend
            // TODO: Update this when backend provides storeId in order response
            // Currently using default store ID (1) for all orders
            // In the future, check if order has storeId or if items contain storeId
            let storeInfo = { name: "FoodSave Store", address: "г. Алматы, ул. Абая, 123" };
            
            try {
              // Option 1: If order has storeId directly (when backend is updated)
              // const storeId = (order as any).storeId;
              
              // Option 2: If items contain storeId (when backend is updated)
              // const firstItem = order.items[0];
              // const storeId = (firstItem as any).storeId;
              
              // For now, using default store ID. Replace with actual storeId when available.
              const storeId = 1; // This should come from order or item data in the future
              
              storeInfo = await getStoreInfo(storeId);
            } catch (error) {
              console.warn("Failed to get store info for order", order.id, error);
            }

            return {
              id: order.id.toString(),
              orderNumber: order.orderNumber || `ORD-${order.id}`,
              status: order.status.toLowerCase(),
              total: Number(order.total),
              items: order.items.map((item: ApiOrderItem) => ({
                id: item.id.toString(),
                productId: item.productId.toString(),
                productName: item.productName,
                productImage: "/placeholder.svg", // API doesn't provide image
                quantity: item.quantity,
                unitPrice: Number(item.price),
                totalPrice: Number(item.subtotal),
                categoryName: undefined // API doesn't provide category name
              })),
              contactPhone: order.customerPhone || user?.phone || "+7 (777) 123-45-67",
              paymentMethod: order.paymentMethod.toLowerCase(),
              createdAt: order.createdAt,
              deliveryNotes: order.comment,
              userName: order.customerName || user?.firstName + " " + user?.lastName,
              userEmail: user?.email,
              storeName: storeInfo.name,
              storeAddress: storeInfo.address
            };
          })
        );
        
        setOrders(transformedOrders);
      } catch (apiError) {
        console.warn("API not available, using mock data:", apiError);
        
        // Fallback to mock data if API is unavailable
        // Get store info for mock data as well
        const storeInfo = await getStoreInfo(1);
        
        const mockOrders: Order[] = [
          {
            id: "1",
            orderNumber: "ORD-2025-001",
            status: "completed",
            total: 2500,
            items: [
              {
                id: "1",
                productId: "1",
                productName: "Овощной бокс",
                productImage: "/placeholder.svg",
                quantity: 1,
                unitPrice: 1200,
                totalPrice: 1200,
                categoryName: "Овощи"
              },
              {
                id: "2",
                productId: "2",
                productName: "Фруктовый бокс",
                productImage: "/placeholder.svg",
                quantity: 1,
                unitPrice: 1300,
                totalPrice: 1300,
                categoryName: "Фрукты"
              }
            ],
            contactPhone: user?.phone || "+7 (777) 123-45-67",
            paymentMethod: "card",
            createdAt: "2025-06-17T10:30:00Z",
            deliveryNotes: "Доставить до 18:00",
            userName: user?.firstName + " " + user?.lastName || "Пользователь",
            userEmail: user?.email,
            storeName: storeInfo.name,
            storeAddress: storeInfo.address
          },
          {
            id: "2",
            orderNumber: "ORD-2025-002",
            status: "processing",
            total: 1800,
            items: [
              {
                id: "3",
                productId: "3",
                productName: "Мясной бокс",
                productImage: "/placeholder.svg",
                quantity: 1,
                unitPrice: 1800,
                totalPrice: 1800,
                categoryName: "Мясо"
              }
            ],
            contactPhone: user?.phone || "+7 (777) 123-45-67",
            paymentMethod: "cash",
            createdAt: "2025-06-18T09:15:00Z",
            userName: user?.firstName + " " + user?.lastName || "Пользователь",
            userEmail: user?.email,
            storeName: storeInfo.name,
            storeAddress: storeInfo.address
          }
        ];
        
        setOrders(mockOrders);
      }
    } catch (err) {
      setError("Ошибка при загрузке заказов");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Separate effect for generating QR codes
  useEffect(() => {
    if (orders.length === 0) return;
    
    const generateQRCodes = async () => {
      const qrPromises = orders.map(async (order) => {
        const orderInfo = {
          orderNumber: order.orderNumber,
          total: order.total,
          customerName: order.userName,
          customerPhone: order.contactPhone,
          status: order.status,
          createdAt: order.createdAt,
          storeName: order.storeName
        };
        
        const qrData = JSON.stringify(orderInfo);
        const qrUrl = await QRCode.toDataURL(qrData, {
          width: 150,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        
        return { orderId: order.id, qrUrl };
      });

      const qrResults = await Promise.all(qrPromises);
      const qrMap = qrResults.reduce((acc, { orderId, qrUrl }) => {
        acc[orderId] = qrUrl;
        return acc;
      }, {} as Record<string, string>);

      setQrCodes(qrMap);
    };
    
    generateQRCodes();
  }, [orders]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Выполнен
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            В обработке
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Отменен
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Ожидает
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Package className="w-3 h-3 mr-1" />
            Новый
          </Badge>
        );
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method.toLowerCase()) {
      case "card":
        return "Банковская карта";
      case "cash":
        return "Наличные";
      case "online":
        return "Онлайн оплата";
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Ошибка</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchOrders}>Попробовать снова</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">История заказов</h1>
          <p className="text-muted-foreground">
            Всего заказов: {orders.length}
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Заказов пока нет</h3>
            <p className="text-muted-foreground text-center mb-4">
              Когда вы сделаете первый заказ, он появится здесь
            </p>
            <Link href="/products">
              <Button>Перейти к покупкам</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Заказ {order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                    {order.storeName && (
                      <p className="text-sm text-muted-foreground">
                        Магазин: {order.storeName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <Badge variant="outline">{order.total} ₸</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* QR Code */}
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  {qrCodes[order.id] ? (
                    <div className="text-center">
                      <img
                        src={qrCodes[order.id]}
                        alt={`QR код для заказа ${order.orderNumber}`}
                        className="mx-auto mb-2"
                      />
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <QrCode className="h-3 w-3" />
                        QR код заказа
                      </p>
                    </div>
                  ) : (
                    <Skeleton className="h-[150px] w-[150px]" />
                  )}
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Состав заказа:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.productImage && item.productImage !== "/placeholder.svg" ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {item.unitPrice} ₸
                            </p>
                            {item.categoryName && (
                              <p className="text-xs text-muted-foreground">
                                Категория: {item.categoryName}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-semibold">{item.totalPrice} ₸</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Способ оплаты:</p>
                    <p className="font-medium">
                      {getPaymentMethodText(order.paymentMethod)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Контактный телефон:</p>
                    <p className="font-medium">{order.contactPhone}</p>
                  </div>
                  {order.storeAddress && (
                    <div>
                      <p className="text-muted-foreground">Адрес магазина:</p>
                      <p className="font-medium">{order.storeAddress}</p>
                    </div>
                  )}
                  {order.deliveryNotes && (
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">Комментарий к доставке:</p>
                      <p className="font-medium">{order.deliveryNotes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Итого:</span>
                  <span>{order.total} ₸</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}