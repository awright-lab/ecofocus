// app/reports/layout.tsx
import { CartProvider } from "@/app/store/cart";
import CartButton from "@/components/CartButton";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartButton />
    </CartProvider>
  );
}
