import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sellerdashboard from "./pages/Vendor/Sellerdashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/Protectedroute";
import OTP from "./pages/otp";
import AdminProfile from "./pages/Adminprofile";
import ProductPage from "./pages/Vendor/Productpage";
import AddProduct from "./pages/Vendor/Addproduct";
import Buyerandsellerdashboard from "./pages/BuyerandSeller/BuyerandSellerdashboard";
import Buyerdashboard from "./pages/Customer/Buyerdashboard";
import Viewproduct from "./pages/Vendor/Viewproduct";
import Editproduct from "./pages/Vendor/Editproduct";
import ViewBuyerProduct from "./components/Buyer/Viewbuyerproduct";
import CartPage from "./pages/Customer/Cartpage";
import Buyerproductfilter from "./pages/Customer/Buyerproductfilter";
import BuyerOrderSuccess from "./pages/Customer/Buyerordersuccesspage";
import BuyerOrders from "./pages/Customer/Buyerorders";
import SellerProfile from "./pages/Sellerprofile";
import BuyerSettings from "./components/Buyer/Settings/Buyer_settings";
import SellerSettings from "./components/Seller/Settings/Seller_settings";
import BuyerChangePassword from "./components/Buyer/Settings/Buyer_Change_password";
import SellerChangePassword from "./components/Seller/Settings/Seller_change_password";
import BuyerUpdateEmail from "./components/Buyer/Settings/Buyer_update_email";
import SellerUpdateEmail from "./components/Seller/Settings/Seller_update_email";
import BuyerProfile from "./pages/Buyerprofile";
import Buyerdashboardpage from "./pages/Customer/Dashboardpage(Buyer)";
import WishlistPage from "./pages/Customer/Wishlistpage";
import DevelopmentPage from "./pages/InDevelopmentpage";
import { AuthProvider } from "./Context/AuthContext";
import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/Notfoundpage";
import AdminProtectedroute from "./components/AdminProtectedroute";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSellerRequests from "./components/Admin/AdminSelllerrequests";
import ViewSellersProfileDetails from "./components/Admin/ViewSellersProfileDetails";
import BuyerOrderDetails from "./pages/Customer/Buyerorderdetails";
import SellerOrders from "./pages/Vendor/Sellerorders";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans">
          <ToastContainer position="top-right" autoClose={2000} />

          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/otp" element={<OTP />} />

            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedroute allowedRole="admin">
                  <AdminDashboardPage />
                </AdminProtectedroute>
              }
            />

            <Route
              path="/admin/profile"
              element={
                <AdminProtectedroute allowedRole="admin">
                  {" "}
                  <AdminProfile />{" "}
                </AdminProtectedroute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedroute allowedRole="admin">
                  {" "}
                  <AdminUsersPage />{" "}
                </AdminProtectedroute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminProtectedroute allowedRole="admin">
                  <AdminProductsPage />
                </AdminProtectedroute>
              }
            />
            <Route
              path="/admin/seller-requests"
              element={
                <AdminProtectedroute allowedRole="admin">
                  <AdminSellerRequests />
                </AdminProtectedroute>
              }
            />
            <Route path="/admin/users/:id" element={<AdminProtectedroute allowedRole="admin"><ViewSellersProfileDetails /></AdminProtectedroute>} />

            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRole="seller">
                  <Sellerdashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRole="seller">
                  <ProductPage />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/add"
              element={
                <ProtectedRoute allowedRole="seller">
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRole="seller">
                  <Sellerdashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/products/view/:id"
              element={
                <ProtectedRoute allowedRole="seller">
                  <Viewproduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/edit/:id"
              element={
                <ProtectedRoute allowedRole="seller">
                  <Editproduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/profile"
              element={
                <ProtectedRoute allowedRole="seller">
                  <SellerProfile />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/seller/settings"
              element={
                <ProtectedRoute allowedRole="seller">
                  <SellerSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/settings/changepassword"
              element={
                <ProtectedRoute allowedRole="seller">
                  <SellerChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/settings/update-email"
              element={
                <ProtectedRoute allowedRole="seller">
                  <SellerUpdateEmail />
                </ProtectedRoute>
              }
            />

            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/billing" element={<DevelopmentPage />} />
            <Route path="/seller/employee" element={<DevelopmentPage />} />
            <Route path="/seller/analytics" element={<DevelopmentPage />} />
            <Route path="/seller/Customer" element={<DevelopmentPage />} />
            <Route path="/seller/notifications" element={<DevelopmentPage />} />

            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <Buyerdashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/product/:id"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <ViewBuyerProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/cart"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/products"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <Buyerproductfilter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/order-success"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerOrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/order/:id"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerOrderDetails />
                </ProtectedRoute>
              }
            />


            <Route
              path="/buyer/orders"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buyer/settings"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/settings/changepassword"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buyer/settings/update-email"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerUpdateEmail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buyer/profile"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <BuyerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/dashboardpage"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <Buyerdashboardpage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/wishlist"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <WishlistPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/both/dashboard"
              element={
                <ProtectedRoute allowedRole="both">
                  <Buyerandsellerdashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
