"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(33,188,96,0.4)]">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Оплата успешна!
        </h1>

        {/* Description */}
        <p className="text-foreground/70 text-lg mb-2">
          Ваш заказ успешно оплачен
        </p>

        {orderId && (
          <p className="text-foreground/50 text-sm mb-8">
            Номер заказа: #{orderId}
          </p>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/catalog")}
            className="w-full h-14 rounded-full bg-primary hover:bg-primary-hover text-white text-lg font-semibold shadow-[0_0_20px_rgba(33,188,96,0.3)]"
          >
            Вернуться в каталог
          </Button>

          <Link href="/cart">
            <Button
              variant="outline"
              className="w-full h-14 rounded-full border-white/10 hover:bg-element-bg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Вернуться в корзину
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground/70">Загрузка...</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
