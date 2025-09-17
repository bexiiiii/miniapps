export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Уведомления отключены</h1>
          <p className="text-muted-foreground">
            Все уведомления теперь приходят напрямую в нашего Telegram-бота. Откройте бота, чтобы получать
            новости о новых товарах и боксах.
          </p>
        </div>
      </main>
    </div>
  );
}
