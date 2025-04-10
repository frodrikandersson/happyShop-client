import React from "react";
import classes from "./AddToCartButtons.module.css"; 
import { useProductToCart } from "../../hooks/useProductToCart";
import { IProducts } from "../../models/IProducts";

interface AddToCartButtonsProps {
  product: IProducts;
}

const AddToCartButtons: React.FC<AddToCartButtonsProps> = ({ product }) => {
  const {
    quantities,
    cartMessage,
    addedProduct,
    handleQuantityChange,
    handleAddToCart,
  } = useProductToCart();

  const quantity = quantities[product.id!] || 1;
  const maxStock = product.adjustedStock;

  return (
    <>
      <div className={classes.quantityControl}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(product.id!, quantity - 1, maxStock);
          }}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          name={product.id!.toString()}
          value={quantity}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            handleQuantityChange(product.id!, parseInt(e.target.value) || 1, maxStock)
          }
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(product.id!, quantity + 1, maxStock);
          }}
          disabled={quantity >= maxStock}
        >
          +
        </button>
      </div>

      <button
        className={classes.addToCart}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product);
        }}
        disabled={maxStock === 0}
      >
        {addedProduct === product.id
          ? cartMessage
          : maxStock > 0
          ? "Add to Cart"
          : "Out of Stock"}
      </button>
    </>
  );
};

export default AddToCartButtons;