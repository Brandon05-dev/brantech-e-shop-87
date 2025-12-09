import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

// Store pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";

// Admin pages - Completely separate admin system
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Store Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/track-order/:orderId" element={<OrderTracking />} />

              {/* Admin Routes - Completely Separate System */}
              {/* Public admin login */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
            <VercelAnalytics />
            </TooltipProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
