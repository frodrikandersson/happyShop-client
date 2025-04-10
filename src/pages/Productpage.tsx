import { useState } from "react";
import { useProducts } from "../hooks/useProduct";
import classes from "./Pages.module.css";
import ProductInfo from "../components/ProductInfo";
import AddToCartButtons from "../components/AddToCartButtons";
import GoogleSearch from "../components/GoogleSearch";



export const Productpage = () => {
  const { products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const validProducts = products.filter((product) => product.id !== null);
  
  return (
    <div className={classes.productPage}>
      <GoogleSearch />
      <h1>Our Products</h1>
      <div className={classes.productGrid}>
      {validProducts.map((product) => {
        const productId = product.id;
        return (
          <div
            key={productId}
            className={classes.productCard}
            onClick={() => setSelectedProductId(productId)}
          >
            <img className={classes.productImg} src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p className={classes.productCardDescription}>{product.description}</p>
            <p className={classes.price}>${product.price.toFixed(2)}</p>
            <p className={classes.stock}>Stock: {product.adjustedStock}</p>

            <AddToCartButtons product={product} />
          </div>
        );
      })}
        {selectedProductId != null && (
          <div className={classes.modalOverlay} onClick={() => setSelectedProductId(null)}>
            <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
              <ProductInfo
                key={selectedProductId}
                productID={selectedProductId}
                onClose={() => setSelectedProductId(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};