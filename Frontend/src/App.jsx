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

function App() {
  const [cartVisible, setCartVisible] = useState(false); // State for cart visibility
  const {isAuth,isAdmin} = UserData();
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <CartProvider> {/* Wrap with CartProvider */}
          <NotificationProvider>
            <Navbar />
            <div className="Pages flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
                <Route path="/products" element={<Products />} />
                <Route exact path="/products/:id" element={<ProdDetail />} />
                <Route path="/admin/blogs" element={isAdmin ? <AdminBlogs /> : <Products/>} />
                <Route path="/admin/products" element={isAdmin ? <AdminProduct />: <Products/>} />
                <Route path="/admin" element={isAdmin ? <Admin />: <Products/>} />
                <Route path="/admin/blogs/create" element={isAdmin ? <BlogEditor />: <Products/>} />
                <Route path="/admin/blogs/edit/:id" element={isAdmin ? <BlogEditor />: <Products/>} />
                <Route path="/admin/ebooks/" element={isAdmin ? <AdminEbooks />: <Products/>} />
                <Route path="/admin/ebooks/create" element={isAdmin ? <CreateEbook />: <Products/>} />
                <Route path="/ebooks" element={<Ebook />} />
              </Routes>
            </div>
            <Footer/>
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