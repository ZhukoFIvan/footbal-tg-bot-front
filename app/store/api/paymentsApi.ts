import { baseApi } from "./baseApi";

export interface CreatePaymentRequest {
  payment_method: "card" | "sbp"; // Провайдер выбирается автоматически: card → FreeKassa, sbp → Paypalych
  promo_code?: string;
  bonus_to_use?: number;
}

export interface PaymentResponse {
  payment_id: string;
  payment_url: string;
  order_id: number;
  amount: number;
  status: string;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Создать платеж из корзины
    createPayment: builder.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (body) => ({
        url: "/cart/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Bonus"],
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentsApi;
