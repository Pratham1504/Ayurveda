import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages & Components
import Home from './Pages/Home';
import BlogPage from './Pages/Blogs';
import Products from './Pages/Products'; // Import the Products page
import Navbar from './Components/Navbar';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import Cart from './components/Cart'; // Import the Cart component
import { CartProvider } from './Context/CartContext'; // Import CartProvider
import ProdDetail from './components/ProdDetail';
import { useState } from 'react';
import AdminBlogs from './Pages/AdminBlogs';
import AdminProduct from './Pages/AdminProduct';
import AdminEbooks from './Pages/AdminEbooks';
import Admin from './Pages/AdminPage';
import BlogEditor from './components/BlogEditor';
import CreateEbook from './components/CreateEbook';
import { NotificationProvider } from './context/NotificationContext';
import Ebook from './Pages/ebooks';

function App() {
  const [cartVisible, setCartVisible] = useState(false); // State for cart visibility

  return (
    <div className="App w-full lg:w-3/4 mx-auto">
      <BrowserRouter>
        <CartProvider> {/* Wrap with CartProvider */}
          <NotificationProvider>
            <Navbar />
            <div className="Pages">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
                <Route path="/products" element={<Products />} />
                <Route exact path="/products/:id" element={<ProdDetail />} />
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/products" element={<AdminProduct />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/blogs/create" element={<BlogEditor />} />
                <Route path="/admin/blogs/edit/:id" element={<BlogEditor />} />
                <Route path="/admin/ebooks/" element={<AdminEbooks />} />
                <Route path="/admin/ebooks/create" element={<CreateEbook />} />
                <Route path="/ebooks" element={<Ebook />} />
              </Routes>
            </div>
            <Footer />
            <button
              className="fixed bottom-4 right-4 bg-green-400 text-white p-2 rounded-full shadow-lg"
              onClick={() => setCartVisible(!cartVisible)} // Toggle cart visibility
            >
              Cart
            </button>
            {cartVisible && (
              <div className="fixed top-0 right-0 h-full w-80 bg-gray-100 shadow-lg transition-transform transform translate-x-0">
                <Cart onClose={() => setCartVisible(false)} />
              </div>
            )}
          </NotificationProvider>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
  