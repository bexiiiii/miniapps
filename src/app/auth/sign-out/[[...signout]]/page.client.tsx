"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "~/lib/auth-context";
import { cn } from "~/lib/cn";
import { useMounted } from "~/lib/hooks/use-mounted";
import { Button, buttonVariants } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

export function SignOutPageClient() {
  const router = useRouter();
  const { logout } = useAuth();
  const mounted = useMounted();

  const handlePageBack = async () => {
    router.back();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Вы успешно вышли из аккаунта");
      router.push("/");
    } catch (error) {
      toast.error("Ошибка при выходе из аккаунта");
      console.error(error);
    }
  };

  return (
    <div
      className={`
        flex w-auto flex-col-reverse justify-center gap-2
        sm:flex-row
      `}
    >
      <Button onClick={handlePageBack} size="default" variant="outline">
        Назад
        <span className="sr-only">Предыдущая страница</span>
      </Button>
      {mounted ? (
        <Button onClick={handleSignOut} size="default" variant="secondary">
          Выйти
          <span className="sr-only">
            Это действие выведет вас из аккаунта.
          </span>
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "default", variant: "secondary" }),
            "bg-muted text-muted-foreground",
          )}
        >
          Log out
        </Skeleton>
      )}
    </div>
  );
}
