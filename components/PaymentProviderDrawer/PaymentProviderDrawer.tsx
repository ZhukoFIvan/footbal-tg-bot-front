"use client";

import { useState, useEffect } from "react";
import { Smartphone, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AccountInfoForm,
  AccountFormData,
} from "@/components/AccountInfoForm/AccountInfoForm";

interface PaymentProviderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: "card" | "sbp", accountInfo: AccountFormData) => void;
  isLoading?: boolean;
  accountInfo: AccountFormData;
  onAccountInfoChange: (data: AccountFormData) => void;
}

export function PaymentProviderDrawer({
  isOpen,
  onClose,
  onSelectMethod,
  isLoading = false,
  accountInfo,
  onAccountInfoChange,
}: PaymentProviderDrawerProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "sbp" | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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

  const validateAccountInfo = (): boolean => {
    const errors: Record<string, string> = {};

    if (!accountInfo.account_type) {
      errors.account_type = "Выберите тип аккаунта";
    }

    if (!accountInfo.account_email.trim()) {
      errors.account_email = "Введите email или телефон";
    } else if (accountInfo.account_type !== "Facebook") {
      // Валидация email для EA и Google
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(accountInfo.account_email)) {
        errors.account_email = "Неверный формат email";
      }
    }

    if (!accountInfo.account_name.trim()) {
      errors.account_name = "Введите имя аккаунта";
    }

    if (
      (accountInfo.account_type === "Facebook" ||
        accountInfo.account_type === "Google") &&
      !accountInfo.account_password
    ) {
      errors.account_password = "Пароль обязателен для этого типа аккаунта";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMethodSelect = (method: "card" | "sbp") => {
    if (!isLoading) {
      if (validateAccountInfo()) {
        setSelectedMethod(method);
        onSelectMethod(method, accountInfo);
      }
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

          {/* Account Info Form */}
          <AccountInfoForm
            value={accountInfo}
            onChange={onAccountInfoChange}
            errors={validationErrors}
          />

          <div className="my-4 border-t border-white/10"></div>

          {/* Payment Methods - Только способ оплаты */}
          <div className="space-y-4">
            {/* Card - автоматически выберет FreeKassa */}
            {/* Временно отключено */}
            {/* <button
              onClick={() => handleMethodSelect("card")}
              disabled={isLoading}
              className={`w-full p-4 rounded-2xl border-2 transition-all disabled:opacity-50 ${
                selectedMethod === "card"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-background hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">
                      Картой
                    </div>
                    <div className="text-sm text-foreground/60">
                      Банковская карта
                    </div>
                  </div>
                </div>
                {selectedMethod === "card" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button> */}

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
                      СБП
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
