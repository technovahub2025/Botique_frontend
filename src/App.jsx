import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import AdminRequireAuth from './components/AdminRequireAuth';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import ProductForm from './pages/Admin/ProductForm';
import AdminCategories from './pages/Admin/Categories';
import AdminCollections from './pages/Admin/Collections';
import AdminOrders from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';

import Homepage from './pages/Admin/Homepage';
import Settings from './pages/Admin/Settings';
import AccountLayout from './layouts/AccountLayout';
import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Account from './pages/Account';
import Orders from './pages/Account/Orders';
import OrderDetails from './pages/Account/OrderDetails';
import About from './pages/About';
import Contact from './pages/Contact';

const ErrorBoundaryWithReset = (props) => {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname} {...props} />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:slug" element={<ProductDetails />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="collections/:slug" element={<CollectionPage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />

              <Route element={<RequireAuth />}>
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success/:id" element={<OrderSuccess />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route element={<AccountLayout />}>
                  <Route path="account" element={<Account />} />
                  <Route path="account/orders" element={<Orders />} />
                  <Route path="account/orders/:id" element={<OrderDetails />} />
                </Route>
              </Route>
            </Route>

            <Route element={<AdminRequireAuth />}>
              <Route element={<AdminLayout />}>
                <Route element={<ErrorBoundaryWithReset title="Dashboard Error" description="An error occurred while loading this page." showHomeButton />}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/products/new" element={<ProductForm />} />
                  <Route path="/admin/products/:id/edit" element={<ProductForm />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/collections" element={<AdminCollections />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/customers" element={<Customers />} />
                  <Route path="/admin/homepage" element={<Homepage />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Route>
              </Route>
            </Route>

            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
