import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import Header from './components/Header.jsx';
import LanguagePillBar from './components/LanguagePillBar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Products from './components/Products.jsx';
import Stories from './components/Stories.jsx';
import Events from './components/Events.jsx';
import RnD from './components/RnD.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import WaterRipple from './components/WaterRipple.jsx';
import ChatAgent from './components/ChatAgent.jsx';
import AdminPortal from './components/AdminPortal.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <>
          <WaterRipple />
          <Header />
        
        <main>
          <Hero />
          <About />
          <Products />
          <Stories />
          <Events />
          <RnD />
          <Contact />
        </main>

        <Footer />
        <LanguagePillBar />
        <ChatAgent />
        <AdminPortal />
        </>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
