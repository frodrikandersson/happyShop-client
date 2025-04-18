import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProduct";
import classes from "./ProductInfo.module.css";
import { IProducts } from "../../models/IProducts";
import AddToCartButtons from "../AddToCartButtons";

interface ProductInfoProps {
    productID: number;
    onClose: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ productID, onClose }) => {
    const [product, setProduct] = useState<IProducts | null>(null);
    const [showProduct, setShowProduct] = useState(false);
    const { handleGetOneProduct } = useProducts();

    useEffect(() => {
        const fetchProduct = async () => {
            const newProduct = await handleGetOneProduct(productID);
            if (!newProduct) return;
            setProduct(newProduct);
            setShowProduct(true);
            console.log("GetProduct called", newProduct);
        };

        fetchProduct();
        console.log("useEffect triggered for ProductInfo component");
    }, []);

    const handleClose = () => {
        setProduct(null);
        setShowProduct(false);
        onClose();
        console.log("ProductInfo closed");
    };

    return (
        <>
            {showProduct && (
                <div className={classes.productInfoWrapper}>
                    <button onClick={handleClose} className={classes.closeButton}>X</button>
                    <h1 className={classes.productInfoTitle}>Product Information</h1>
                    {product && showProduct && (
                        <div className={classes.productInfo}>
                            <h2>{product.name}</h2>
                            <img src={product.image} alt={product.name} className={classes.productImage} />
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Stock: {product.adjustedStock}</p>
                            <p>Category: {product.category}</p>
                        </div>
                    )}
                    { product && <AddToCartButtons product={product} /> }
                </div>
            )}
        </>
    );
}

export default ProductInfo;