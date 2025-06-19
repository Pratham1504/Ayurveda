import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages & Components
import Home from './Pages/Home';
import BlogPage from './Pages/Blogs';
import Products from './Pages/Products'; // Import the Products page
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import BlogDetail from './Components/BlogDetail';
import Cart from './Components/Cart'; // Import the Cart component
import { CartProvider } from './Context/CartContext'; // Import CartProvider
import ProdDetail from './Components/ProdDetail';
import { useState } from 'react';
import AdminBlogs from './Pages/AdminBlogs';
import AdminProduct from './Pages/AdminProduct';
import AdminEbooks from './Pages/AdminEbooks';
import Admin from './Pages/AdminPage';
import BlogEditor from './Components/BlogEditor';
import CreateEbook from './Components/CreateEbook';
import { NotificationProvider } from './Context/NotificationContext';
import Ebook from './Pages/ebooks';
import { UserData } from './Context/UserContext';
import MyOrders from './Pages/MyOrders';
import OrderDetail from './Pages/OrderDetail';
import Appointment from './Pages/consulting';
import AdminAppointments from './Pages/AdminAppointment'
import HeroSection from './Pages/Home/HeroSection';
import AboutUs from './Pages/AboutUs';
import AdminOrders from './Pages/AdminOrders';
import ResetPassword from './Pages/ResetPassword';
import Checkout from './Pages/Checkout';
import ScrollToTop from "./Components/ScrollToTop";
import PrivacyPolicy from './Pages/PrivacyPolicy';
import RefundPolicy from './Pages/RefundPolicy';
import TermsOfService from './Pages/TermsOfService';
import ContactUs from './Pages/ContactUs';

function App() {
  const [cartVisible, setCartVisible] = useState(false); // State for cart visibility
  const { isAuth, isAdmin } = UserData();
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <ScrollToTop /> {/* Scroll to top on route change */}
        <CartProvider> {/* Wrap with CartProvider */}
          <NotificationProvider>
            <Navbar setCartVisible={setCartVisible} />
            {cartVisible && <Cart onClose={() => setCartVisible(false)} />}
            <div className="Pages flex-grow w-full pt-16">
              {/* <HeroSection /> */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
                <Route path="/products" element={<Products />} />
                <Route exact path="/products/:id" element={<ProdDetail />} />
                <Route path="/admin/blogs" element={isAdmin ? <AdminBlogs /> : <Products />} />
                <Route path="/admin/products" element={isAdmin ? <AdminProduct /> : <Products />} />
                <Route path="/admin" element={isAdmin ? <Admin /> : <Products />} />
                <Route path="/admin/blogs/create" element={isAdmin ? <BlogEditor /> : <Products />} />
                <Route path="/admin/blogs/edit/:id" element={isAdmin ? <BlogEditor /> : <Products />} />
                <Route path="/admin/ebooks/" element={isAdmin ? <AdminEbooks /> : <Products />} />
                <Route path="/admin/ebooks/create" element={isAdmin ? <CreateEbook /> : <Products />} />
                <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <Products />} />
                <Route path="/ebooks" element={<Ebook />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/consulting" element={<Appointment />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route exact path="/my-orders/:id" element={<OrderDetail />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </div>
            <Footer />

            {/* FLOATING CART -- Removed */}
            {/* <button
              className="fixed bottom-4 right-4 bg-green-400 text-white p-2 rounded-full shadow-lg"
              onClick={() => setCartVisible(!cartVisible)} // Toggle cart visibility
            >
              Cart
            </button> */}
            {/* {cartVisible && (
              <div className="fixed top-0 right-0 h-full w-80 bg-gray-100 shadow-lg transition-transform transform translate-x-0">
                <Cart onClose={() => setCartVisible(false)} />
              </div>
            )} */}
          </NotificationProvider>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;