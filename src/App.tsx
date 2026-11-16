import React from 'react';
import { Home } from './pages/Home';
import { CartProvider } from './context/CartContext';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <Home />
    </CartProvider>
  );
};

export default App;
