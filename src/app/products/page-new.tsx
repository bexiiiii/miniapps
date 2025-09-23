"use client";

import { Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { apiClient, type Product, type PaginatedResponse, type Category } from "~/lib/api-client";
import { useCart } from "~/lib/hooks/use-cart";
import { ProductCard } from "~/ui/components/product-card";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Skeleton } from "~/ui/primitives/skeleton";

interface ProductPageProduct {
  category: string;
  id: string;
  image: string;
  inStock?: boolean;
  name: string;
  originalPrice?: number;
  price: number;
  rating?: number;
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch products
  const fetchProducts = async (page: number = 0, reset: boolean = false) => {
    try {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      let response: PaginatedResponse<Product>;

      if (searchQuery) {
        response = await apiClient.searchProducts(searchQuery, page);
      } else if (selectedCategory !== "all") {
        // Note: We need categoryId, but for now we'll use searchProducts with category name
        response = await apiClient.searchProducts(selectedCategory, page);
      } else {
        response = await apiClient.getFeaturedProducts(page, 12);
      }

      if (reset || page === 0) {
        setProducts(response.content);
      } else {
        setProducts(prev => [...prev, ...response.content]);
      }

      setCurrentPage(response.number);
      setTotalPages(response.totalPages);
      setHasMore(!response.last);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Ошибка загрузки продуктов");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesData = await apiClient.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(0, true);
    fetchCategories();
  }, []);

  // Search/filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(0, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  // Load more products
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(currentPage + 1, false);
    }
  };

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        category: product.category,
      }, 1);
      toast.success("Бронь создана!");
    }
  };

  // Convert API product to component product format
  const convertProduct = (product: Product): ProductPageProduct => ({
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.imageUrl,
    category: product.category,
    rating: product.rating,
    inStock: product.isAvailable,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Боксы с едой</h1>
        <p className="text-muted-foreground mb-6">
          Свежие продукты по выгодным ценам от лучших заведений города
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск продуктов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
            >
              Все категории
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Продукты не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или выберите другую категорию
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={convertProduct(product)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button
                onClick={loadMore}
                disabled={loadingMore}
                size="lg"
              >
                {loadingMore ? "Загрузка..." : "Загрузить ещё"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
