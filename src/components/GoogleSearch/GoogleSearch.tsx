import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import classes from './GoogleSearch.module.css';
import { useSearch } from '../../hooks/useSearch';
import { IGoogleSearchItem } from '../../models/IGoogleSearch';
import { useProducts } from '../../hooks/useProduct';
import { IProducts } from '../../models/IProducts';
import ProductInfo from '../ProductInfo/ProductInfo';

const GoogleSearch = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [items, setItems] = useState<IGoogleSearchItem[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(1);
    const [lastSearchTerm, setLastSearchTerm] = useState<string>('');
    const [productList, setProductList ] = useState<IProducts[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const { handleGetSearch } = useSearch();
    const { handleShowProducts } = useProducts();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await handleShowProducts();
                setProductList(products);
                console.log(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    const handleSearch = async (e?: FormEvent, newStartIndex: number = 1) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        const term = searchText || lastSearchTerm;
        setLastSearchTerm(term);

        const data = await handleGetSearch(term, newStartIndex);
        if (data?.items) {
            setItems(data.items);
            setStartIndex(newStartIndex);
            setTotalResults(parseInt(data.searchInformation?.totalResults || "0", 10));
            setCurrentPage(Math.floor((newStartIndex - 1) / 10) + 1);
        } else {
            setItems(null);
        }
    }

    const closeResults = () => {
        setItems(null);
        setIsSearching(false);
        setSelectedProductId(null);
    }

    const cleanImageUrl = (url: string) => url.split('?')[0];

    return (
        <div className={classes.wrapper}>
            <h2 className={classes.title}>Search product list</h2>
            <section className={classes.searchHeader}>
                <form id="search-form" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className={classes.searchInput} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)} 
                    />
                    <button type="submit" className={classes.searchButton}>
                        Search
                    </button>
                </form>
            </section>

            {isSearching && items && (
                <>
                    <div className={classes.modalOverlay} onClick={closeResults}></div>
                    <div className={classes.searchModal}>
                        <div className={classes.modalHeader}>
                            <h2 className={classes.resultTitle}>Results</h2>
                            <button onClick={closeResults} className={classes.closeButton}>✕</button>
                            {items && totalResults > 10 && (
                                <div className={classes.pagination}>
                                    <button 
                                        className={classes.pageButton}
                                        onClick={() => handleSearch(undefined, startIndex - 10)} 
                                        disabled={startIndex <= 1}
                                    >
                                        ← Previous
                                    </button>
                                    <span className={classes.pageInfo}>
                                        Page {currentPage} of {Math.ceil(totalResults / 10)}
                                    </span>
                                    <button 
                                        className={classes.pageButton}
                                        onClick={() => handleSearch(undefined, startIndex + 10)} 
                                        disabled={startIndex + 10 > totalResults}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                        {items.map((item, index) => {
                            const imageSrc = item.pagemap?.cse_image?.[0]?.src || '';
                            const cleanedImageSrc = cleanImageUrl(imageSrc);
                            const matchedProduct = productList.find(p => cleanImageUrl(p.image) === cleanedImageSrc);
                            const isMatch = Boolean(matchedProduct);

                            return (
                                <div 
                                    key={index} 
                                    className={classes.resultCard}
                                    onClick={() => isMatch && setSelectedProductId(matchedProduct!.id!)}
                                    style={{ cursor: isMatch ? 'pointer' : 'not-allowed' }}
                                >
                                    <section className={classes.thumbnailSection}>
                                        {item.pagemap?.cse_thumbnail?.[0]?.src ? (
                                            <img
                                                src={item.pagemap.cse_thumbnail[0].src}
                                                alt="Thumbnail"
                                                className={classes.thumbnail}
                                            />
                                        ) : imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt="Placeholder"
                                                className={classes.thumbnail}
                                            />
                                        ) : (
                                            <div className={classes.noImage}>No image</div>
                                        )}
                                    </section>

                                    <section className={classes.resultContent}>
                                        <h3 className={classes.resultHeading}>{item.title}</h3>
                                        <p className={classes.resultSnippet}>{item.snippet}</p>
                                        {isMatch ? (
                                            <span className={classes.resultLink}>View Product →</span>
                                        ) : (
                                            <span className={classes.resultLink} style={{ opacity: 0.4 }}>
                                                No match found
                                            </span>
                                        )}
                                    </section>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {!isSearching && selectedProductId != null && (
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
    );
};

export default GoogleSearch;