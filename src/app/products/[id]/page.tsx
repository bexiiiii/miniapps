"use client";

import { ArrowLeft, Minus, Plus, Star, Clock, MapPin, ChevronLeft, ChevronRight, Share2, TicketCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { apiClient, type Product } from "~/lib/api-client";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { Separator } from "~/ui/primitives/separator";
import { Skeleton } from "~/ui/primitives/skeleton";
import { Badge } from "~/ui/primitives/badge";
import { cn } from "~/lib/cn";
import { ProductMetaTags } from "~/components/ProductMetaTags";
import { SEO_CONFIG } from "~/app";

type TelegramWebApp = {
  sendData?: (data: string) => void;
  openTelegramLink?: (url: string) => void;
  close?: () => void;
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

const encodePayload = (value: string) => {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return encodeURIComponent(btoa(binary));
  } catch (error) {
    console.error("Failed to encode payload for Telegram link:", error);
    return "";
  }
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("ru-RU", {
  currency: "KZT",
  style: "currency",
});

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleReserve = () => {
    if (!product) {
      return;
    }

    const reservationSummary = {
      action: "reserve_product",
      productId: product.id,
      productName: product.name,
      storeName: product.storeName,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      timestamp: new Date().toISOString(),
    };

    const message = [
      "🔒 Бронирование FoodSave",
      `Коробка: ${product.name}`,
      `Магазин: ${product.storeName}`,
      `Количество: ${quantity}`,
      `Итого: ${CURRENCY_FORMATTER.format(product.price * quantity)}`,
    ].join("\n");

    const telegram = typeof window !== "undefined"
      ? (window as TelegramWindow).Telegram?.WebApp
      : undefined;

    const payload = JSON.stringify({
      ...reservationSummary,
      message,
    });

    if (telegram?.sendData) {
      try {
        telegram.sendData(payload);
        telegram.close?.();
        toast.success("Запрос на бронирование отправлен в бот");
        return;
      } catch (error) {
        console.error("Error sending data to Telegram bot:", error);
      }
    }

    const encodedPayload = encodePayload(payload);
    const fallbackLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK ?? SEO_CONFIG.social.telegram;

    if (fallbackLink) {
      const normalizedLink = fallbackLink.endsWith("/")
        ? fallbackLink.slice(0, -1)
        : fallbackLink;
      const linkWithPayload = encodedPayload
        ? `${normalizedLink}?start=${encodedPayload}`
        : normalizedLink;

      if (telegram?.openTelegramLink) {
        telegram.openTelegramLink(linkWithPayload);
        telegram.close?.();
      } else if (typeof window !== "undefined") {
        window.open(linkWithPayload, "_blank", "noopener,noreferrer");
      }
      toast.success("Открываем чат с ботом для бронирования");
      return;
    }

    if (typeof window !== "undefined") {
      const shareLink = `https://t.me/share/url?text=${encodeURIComponent(message)}`;
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
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

  const handleShare = async () => {
    if (!product) return;

    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    const shareTitle = `${product.name} | FoodSave`;

    const shareText = discount > 0
      ? `🔥 СКИДКА ${discount}%! 
${product.name}
💰 Было: ${CURRENCY_FORMATTER.format(product.originalPrice!)}
💸 Сейчас: ${CURRENCY_FORMATTER.format(product.price)}
🏪 ${product.storeName}

Успей купить по выгодной цене!`
      : `🍽️ ${product.name}
💰 Цена: ${CURRENCY_FORMATTER.format(product.price)}
🏪 ${product.storeName}

Вкусно и выгодно!`;

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Ссылка отправлена');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (shareText: string) => {
    const textToShare = `${shareText}\n\n${window.location.href}`;

    navigator.clipboard.writeText(textToShare).then(() => {
      toast.success('Ссылка и описание скопированы в буфер обмена');
    }).catch(() => {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = textToShare;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Ссылка и описание скопированы в буфер обмена');
      } catch (err) {
        toast.error('Не удалось скопировать ссылку');
      }
      document.body.removeChild(textArea);
    });
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

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
      {/* Dynamic Meta Tags for Social Sharing */}
      <ProductMetaTags product={product} />

      {/* Back button */}
      <Link href="/stores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Назад к продуктам
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/placeholder-food.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-300"
              priority
            />

            {/* Navigation arrows - only show if multiple images */}
            {product.images && product.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image counter */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            )}

            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                -{discount}%
              </Badge>
            )}
            {!product.active && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Нет в наличии
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Images - only show if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - изображение ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.categoryName}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            {product.averageRating && (
              <div className="mt-2">
                {renderStars(product.averageRating)}
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
              <p className="text-green-600 dark:text-green-400 font-medium">
                Экономия: {CURRENCY_FORMATTER.format((product.originalPrice || 0) - product.price)}
              </p>
            )}
          </div>

          {/* Store Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                {product.storeLogo ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={product.storeLogo}
                      alt={`${product.storeName} logo`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{product.storeName}</h3>
                  {product.storeAddress && (
                    <p className="text-sm text-muted-foreground">{product.storeAddress}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Годен до: {formatDate(product.expiryDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Описание</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-foreground">Количество:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-foreground">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                (осталось: {product.stockQuantity})
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleReserve}
                disabled={!product.active || product.stockQuantity === 0}
                size="lg"
                className="flex-1"
              >
                <TicketCheck className="h-5 w-5 mr-2" />
                {product.active ? "Забронировать" : "Нет в наличии"}
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="px-4"
                aria-label="Поделиться"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
