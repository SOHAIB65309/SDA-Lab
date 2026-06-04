import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import ProductDetails from './components/Products/ProductDetails';
import Cards from './components/Products/Cards';
import CategoryPage from './components/Products/CategoryPage';
import CategoriesPage from './components/Products/CategoriesPage';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderSuccess from './components/OrderSuccess/OrderSuccess';
import Pofile from './components/Profile/Pofile';
import Wishlist from './components/Wishlist/Wishlist';
import ReturnRequest from './components/Returns/ReturnRequest';

const ProductsPage = () => (
  <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: '#f0f7ff' }}>
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="badge mb-2">All Products</span>
        <h1 className="text-3xl font-bold" style={{ color: '#1e293b' }}>
          Our <span className="sky-text">Collection</span>
        </h1>
      </div>
      <Cards />
    </div>
  </div>
);

const AUTH_ROUTES = ['/login', '/signup'];

function App() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div style={{ background: '#f0f7ff', minHeight: '100vh' }}>
      {!isAuthPage && <Navigation />}

      <Routes>
        <Route path='/'                    element={<Home />} />
        <Route path='/login'               element={<Login />} />
        <Route path='/signup'              element={<SignUp />} />
        <Route path='/products'            element={<ProductsPage />} />
        <Route path='/products/:ProductId' element={<ProductDetails />} />
        <Route path='/categories'          element={<CategoriesPage />} />
        <Route path='/category/:name'      element={<CategoryPage />} />
        <Route path='/cart'                element={<Cart />} />
        <Route path='/checkout'            element={<Checkout />} />
        <Route path="/order-success"       element={<OrderSuccess />} />
        <Route path='/profile'             element={<Pofile />} />
        <Route path='/wishlist'            element={<Wishlist />} />
        <Route path='/returns'             element={<ReturnRequest />} />
        <Route path='/contact'             element={<ContactUs />} />
        <Route path='/about'               element={<AboutUs />} />
        <Route path='/403' element={
          <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f7ff' }}>
            <div className="text-center">
              <div className="text-7xl font-bold sky-text mb-4">403</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>Access Denied</h2>
              <p className="mb-6" style={{ color: '#64748b' }}>You don't have permission to view this page.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        } />
      </Routes>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
