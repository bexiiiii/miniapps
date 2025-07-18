"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { SEO_CONFIG } from "~/app";
import { useAuth } from "~/lib/auth-context";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";

export function SignUpPageClient() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast.error("Необходимо согласиться с условиями использования");
      return;
    }
    
    setLoading(true);

    try {
      await register(formData);
      toast.success("Регистрация прошла успешно!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Ошибка регистрации. Попробуйте еще раз.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        grid h-screen w-screen
        md:grid-cols-2
      `}
    >
      {/* Left side - Image */}
      <div
        className={`
          relative hidden
          md:block
        `}
      >
        <Image
          alt="Sign-up background image"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 0vw, 50vw"
          src="https://images.unsplash.com/photo-1719811059181-09032aef07b8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3"
        />
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-background/80 to-transparent
          `}
        />
        <div className="absolute bottom-8 left-8 z-10 text-white">
          <h1 className="text-3xl font-bold">{SEO_CONFIG.name}</h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Присоединяйся к нам и экономь на еде
          </p>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Создать аккаунт</h1>
              <p className="text-muted-foreground">
                Заполните форму для регистрации
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Айдар"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Нурланов"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Телефон</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+7 (700) 123-45-67"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Terms and Conditions Agreement */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg bg-amber-50 border-amber-200">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                      <div className="font-medium text-amber-800 mb-1">
                        
                      </div>
                      <div className="text-gray-700 text-xs leading-relaxed">
                        Я понимаю и соглашаюсь с
                        <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                          <strong>Политикой конфиденциальности и Политикой использования</strong> 
                        </Link> 
                        
                      </div>
                      <div className="mt-2 text-xs">
                        Согласен с{" "}
                        <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                          Пользовательским соглашением
                        </Link>
                        {" "}и{" "}
                        <Link href="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                          Политикой конфиденциальности
                        </Link>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !acceptedTerms}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Уже есть аккаунт? </span>
              <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
