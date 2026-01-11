"use client";

import { useState, useEffect } from "react";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentProviderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: "card" | "sbp") => void;
  isLoading?: boolean;
}

export function PaymentProviderDrawer({
  isOpen,
  onClose,
  onSelectMethod,
  isLoading = false,
}: PaymentProviderDrawerProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "sbp" | null>(
    null
  );

  // Управление overflow для body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMethodSelect = (method: "card" | "sbp") => {
    if (!isLoading) {
      setSelectedMethod(method);
      onSelectMethod(method);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedMethod(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-[70] animate-slide-up">
        <div className="bg-element-bg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Выберите способ оплаты
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-background rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6 text-foreground/70" />
            </button>
          </div>

          {/* Payment Methods - Только способ оплаты */}
          <div className="space-y-4">
            {/* SBP - автоматически выберет Paypalych */}
            <button
              onClick={() => handleMethodSelect("sbp")}
              disabled={isLoading}
              className={`w-full p-4 rounded-2xl border-2 transition-all disabled:opacity-50 ${
                selectedMethod === "sbp"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-background hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">
                      СБП / QR-код
                    </div>
                    <div className="text-sm text-foreground/60">
                      Оплата через банк
                    </div>
                  </div>
                </div>
                {selectedMethod === "sbp" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
