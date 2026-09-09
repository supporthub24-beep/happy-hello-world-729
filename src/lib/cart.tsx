 import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  bangla: string;
  price: number;
  image: string;
  qty: number;
};

export type OrderStatus = "pending" | "confirmed" | "preparing" | "dispatched" | "delivered" | "cancelled";

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: Date; note?: string }[];
  customer: {
    name: string;
    phone: string;
    address: string;
    landmark?: string;
  };
  paymentMethod: "cod" | "online";
  createdAt: Date;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  currentOrder: Order | null;
  orders: Order[];
  placeOrder: (customer: Order["customer"], paymentMethod: Order["paymentMethod"]) => Order;
  reorder: (orderId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mango-fresh-cart";
const ORDERS_KEY = "mango-fresh-orders";
const CURRENT_ORDER_KEY = "mango-fresh-current-order";

export function parsePrice(price: string) {
  const digits = price.replace(/[^\d.]/g, "");
  return Number(digits) || 0;
}

export function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

const DELIVERY_FEE = 60;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
      
      const ordersRaw = localStorage.getItem(ORDERS_KEY);
      if (ordersRaw) setOrders(JSON.parse(ordersRaw) as Order[]);
      
      const currentRaw = localStorage.getItem(CURRENT_ORDER_KEY);
      if (currentRaw) {
        const parsed = JSON.parse(currentRaw) as Order;
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.statusHistory = parsed.statusHistory.map(h => ({
          ...h,
          timestamp: new Date(h.timestamp),
        }));
        setCurrentOrder(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (currentOrder) {
      localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(currentOrder));
    } else {
      localStorage.removeItem(CURRENT_ORDER_KEY);
    }
  }, [currentOrder, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);

    const placeOrder = (customer: Order["customer"], paymentMethod: Order["paymentMethod"]): Order => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        items: [...items],
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total: subtotal + DELIVERY_FEE,
        status: "confirmed",
        statusHistory: [
          { status: "pending", timestamp: new Date(), note: "অর্ডার সৃষ্টি হচ্ছে" },
          { status: "confirmed", timestamp: new Date(), note: "অর্ডার নিশ্চিত হয়েছে" },
        ],
        customer,
        paymentMethod,
        createdAt: new Date(),
      };
      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      setItems([]);
      return newOrder;
    };

    const reorder = (orderId: string) => {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      setItems(order.items.map(item => ({ ...item })));
    };

    return {
      items,
      count,
      subtotal,
      addItem: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((p) => p.id === item.id);
          if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { ...item, qty }];
        }),
      removeItem: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
        ),
      clear: () => setItems([]),
      currentOrder,
      orders,
      placeOrder,
      reorder,
    };
  }, [items, subtotal, currentOrder, orders]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "পেন্ডিং",
    confirmed: "নিশ্চিত",
    preparing: "প্রস্তুতি চলছে",
    dispatched: "পাঠানো হয়েছে",
    delivered: "ডেলিভারি সম্পূর্ণ",
    cancelled: "বাতিল",
  };
  return labels[status] || status;
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-blue-500",
    preparing: "bg-purple-500",
    dispatched: "bg-indigo-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };
  return colors[status] || "bg-gray-400";
}

export function getStatusDescription(status: OrderStatus): string {
  const descriptions: Record<OrderStatus, string> = {
    pending: "আপনার অর্ডার গ্রহণ করা হয়েছে",
    confirmed: "অর্ডার নিশ্চিত করা হয়েছে",
    preparing: "আমরা আপনার অর্ডার প্রস্তুত করছি",
    dispatched: "আপনার অর্ডার পাঠানো হয়েছে",
    delivered: "অর্ডার সফলভাবে ডেলিভারি হয়েছে",
    cancelled: "অর্ডার বাতিল করা হয়েছে",
  };
  return descriptions[status] || "";
}