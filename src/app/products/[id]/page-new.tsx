"use client";

import { ArrowLeft, Minus, Plus, Star, Clock, MapPin, TicketCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { apiClient, type Product } from "~/lib/api-client";
import { useCart } from "~/lib/hooks/use-cart";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Separator } from "~/ui/primitives/separator";
import { Skeleton } from "~/ui/primitives/skeleton";
import { Badge } from "~/ui/primitives/badge";

const CURRENCY_FORMATTER = new Intl.NumberFormat("ru-RU", {
  currency: "KZT",
  style: "currency",
});

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (productId) {
      fetchProduct(parseInt(productId));
    }
  }, [productId]);

  const fetchProduct = async (id: number) => {
    try {
      setLoading(true);
      const productData = await apiClient.getProductById(id);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Продукт не найден");
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        category: product.category,
      }, quantity);
      toast.success(`${product.name} забронирована!`);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.availableQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-muted-foreground"
              }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating.toFixed(1)} ({product?.reviewCount || 0} отзывов)
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Продукт не найден</h1>
          <Link href="/products">
            <Button>Вернуться к продуктам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/stores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Назад к продуктам
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
              -{discount}%
            </Badge>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Нет в наличии
              </Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.rating && (
              <div className="mt-2">
                {renderStars(product.rating)}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {CURRENCY_FORMATTER.format(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  {CURRENCY_FORMATTER.format(product.originalPrice)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-green-600 font-medium">
                Экономия: {CURRENCY_FORMATTER.format((product.originalPrice || 0) - product.price)}
              </p>
            )}
          </div>

          {/* Store Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span>Заведение: {product.storeName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Годен до: {formatDate(product.expirationDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Количество:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.availableQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                (осталось: {product.availableQuantity})
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.availableQuantity === 0}
              size="lg"
              className="w-full"
            >
              <TicketCheck className="h-5 w-5 mr-2" />
              {product.isAvailable
                ? `Забронировать • ${CURRENCY_FORMATTER.format(product.price * quantity)}`
                : "Нет в наличии"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
