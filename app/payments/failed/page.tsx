"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const error = searchParams.get("error");
  const botUsernameFromQuery = searchParams.get("bot_username");
  const botUsernameFromEnv = process.env.NEXT_PUBLIC_BOT_USERNAME;
  const botUsername = botUsernameFromQuery || botUsernameFromEnv;
  
  // Если bot_username не передан, не открываем бота
  if (!botUsername) {
    console.error("bot_username не передан в URL параметрах");
  }

  const openBot = () => {
    if (!botUsername) {
      console.error("Не удалось открыть бота: bot_username не указан");
      return;
    }
    
    const botUrl = `https://t.me/${botUsername}`;
    // Используем Telegram WebApp API для открытия бота
    if (window.Telegram && window.Telegram.WebApp) {
      // Открываем бота через Telegram
      window.Telegram.WebApp.openTelegramLink(botUrl);
    } else {
      // Fallback: открываем в новом окне
      window.open(botUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-destructive flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <X className="w-12 h-12 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Оплата не прошла
        </h1>

        {/* Description */}
        <p className="text-foreground/70 text-lg mb-2">
          {error || "Произошла ошибка при обработке платежа"}
        </p>

        {orderId && (
          <p className="text-foreground/50 text-sm mb-4">
            Номер заказа: #{orderId}
          </p>
        )}

        {/* Instruction */}
        <p className="text-foreground/60 text-sm mb-8">
          Вернитесь в мини ап после оплаты
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={openBot}
            className="w-full h-14 rounded-full bg-primary hover:bg-primary-hover text-white text-lg font-semibold shadow-[0_0_20px_rgba(33,188,96,0.3)]"
          >
            Перейти в бота
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/70">Загрузка...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
