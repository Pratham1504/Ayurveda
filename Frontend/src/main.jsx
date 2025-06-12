import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './Context/UserContext.jsx';
import { ProductProvider } from './Context/ProductContext';
import { BlogProvider } from './Context/BlogContext';

export const server = "http://localhost:4000";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <ProductProvider>
        <BlogProvider>
          <App />
        </BlogProvider>
      </ProductProvider>
    </UserContextProvider>
  </StrictMode>,
)
