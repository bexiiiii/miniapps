"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Store, Calendar, Package2, Search } from "lucide-react";
import { Card, CardContent } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Input } from "~/ui/primitives/input";
import { apiClient, type Category } from "~/lib/api-client";
import { useLanguage } from "~/contexts/language-context";

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
}

function ProductsPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const storeFromUrl = searchParams.get('store');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "");
  const [selectedStore, setSelectedStore] = useState(storeFromUrl || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStore, setCurrentStore] = useState<any>(null);

  // Update selected category and store when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (storeFromUrl) {
      setSelectedStore(storeFromUrl);
    }
  }, [categoryFromUrl, storeFromUrl]);

  // Fetch store info if store is selected
  useEffect(() => {
    if (selectedStore) {
      const fetchStoreInfo = async () => {
        try {
          const storeInfo = await apiClient.getStoreById(selectedStore);
          setCurrentStore(storeInfo);
        } catch (error) {
          console.error('Error fetching store info:', error);
          setCurrentStore(null);
        }
      };
      fetchStoreInfo();
    } else {
      setCurrentStore(null);
    }
  }, [selectedStore]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let productsResponse;
        
        // Fetch products based on filters
        if (selectedStore) {
          productsResponse = await apiClient.getProductsByStore(parseInt(selectedStore), currentPage, 20);
        } else if (selectedCategory) {
          const category = categories.find(cat => cat.name === selectedCategory);
          if (category) {
            productsResponse = await apiClient.getProductsByCategory(category.id, currentPage, 20);
          } else {
            productsResponse = await apiClient.getProducts(currentPage, 20);
          }
        } else {
          productsResponse = await apiClient.getProducts(currentPage, 20);
        }
        
        // Fetch categories if not already loaded
        let categoriesData = categories;
        if (categories.length === 0) {
          categoriesData = await apiClient.getCategories();
          setCategories(categoriesData);
        }
        
        setProducts(productsResponse.content);
        setTotalPages(productsResponse.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        // Fallback to mock categories if API fails
        try {
          const { categories: mockCategories } = await import('../mocks');
          const mappedMockCategories: Category[] = mockCategories.map((category, index) => ({
            id: index + 1,
            name: category.name,
            description: `${category.productCount} items available`,
            imageUrl: category.image,
            active: true,
          }));
          setCategories(mappedMockCategories);
        } catch {
          setCategories([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedStore, selectedCategory]);

  // Filter products based on search (additional client-side filtering)
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-foreground">Загрузка продуктов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Store Header */}
        {currentStore && (
          <div className="mb-6 p-6 bg-card rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                {currentStore.logo ? (
                  <Image
                    src={currentStore.logo}
                    alt={currentStore.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <Store className="h-8 w-8 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {currentStore.name}
                </h1>
                <p className="text-muted-foreground">
                  {currentStore.address}
                </p>
                {currentStore.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStore.description}
                  </p>
                )}
              </div>
              <Link href="/stores">
                <Button variant="outline">
                  Все Боксы
                </Button>
              </Link>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-foreground mb-4">
          {currentStore ? `Боксы из ${currentStore.name}` : 'Продукты со скидкой'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {currentStore 
            ? `Актуальные предложения и скидки в магазине ${currentStore.name}`
            : 'Найдите качественные продукты по выгодным ценам и помогите бороться с пищевыми отходами'
          }
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск продуктов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            {searchTerm || selectedCategory 
              ? "Боксы не найдены. Попробуйте изменить критерии поиска."
              : "Боксы пока не добавлены."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square rounded-t-lg overflow-hidden">
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-food.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 right-2 text-xs"
                      >
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="p-3 flex flex-col flex-grow">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.categoryName}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-green-600 dark:text-green-400">
                        ₸{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₸{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3 space-y-1 flex-grow">
                    <div className="flex items-center gap-2">
                      {product.storeLogo ? (
                        <div className="relative w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={product.storeLogo}
                            alt={`${product.storeName} logo`}
                            fill
                            sizes="16px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Store className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate font-medium">{product.storeName}</span>
                    </div>
                    {product.storeAddress && (
                      <div className="flex items-center gap-1 pl-6">
                        <span className="text-xs text-muted-foreground/80 truncate">{product.storeAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(product.expiryDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package2 className="h-3 w-3" />
                      <span>Остаток: {product.stockQuantity}</span>
                    </div>
                  </div>

                  <Link href={`/products/${product.id}`} className="mt-auto">
                    <Button className="w-full" size="sm">
                      {t("products.moreDetails")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-foreground">Загрузка...</div>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}