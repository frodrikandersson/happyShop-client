import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";
import type { IProducts } from "../models/IProducts"; 

export const useProductToCart = () => {
  const { addToCart } = useCartContext();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const handleQuantityChange = (id: number, value: number, maxStock: number) => {
    if (value < 1) value = 1;
    if (value > maxStock) value = maxStock;
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product: IProducts) => {
    const quantity = quantities[product.id!] || 1;
    addToCart(product, quantity);
    setAddedProduct(product.id!);
    setCartMessage(`Added ${quantity} × ${product.name} to cart!`);

    setTimeout(() => {
      setCartMessage(null);
      setAddedProduct(null);
    }, 2000);
  };

  return {
    quantities,
    cartMessage,
    addedProduct,
    handleQuantityChange,
    handleAddToCart,
  };
};