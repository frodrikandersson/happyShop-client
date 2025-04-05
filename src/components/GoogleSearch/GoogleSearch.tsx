import { ChangeEvent, FormEvent, useState } from 'react';
import classes from './GoogleSearch.module.css';
import { useSearch } from '../../hooks/useSearch';
import { IGoogleSearchItem } from '../../models/IGoogleSearch';

const GoogleSearch = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [items, setItems] = useState<IGoogleSearchItem[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(1);
    const [lastSearchTerm, setLastSearchTerm] = useState<string>('');

    const { handleGetSearch } = useSearch();

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
    }

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
                        {items.map((item, index) => (
                            <div key={index} className={classes.resultCard}>
                                <section className={classes.thumbnailSection}>
                                    {item.pagemap?.cse_thumbnail?.[0]?.src ? (
                                        <img
                                            src={item.pagemap.cse_thumbnail[0].src}
                                            alt="Thumbnail"
                                            className={classes.thumbnail}
                                        />
                                    ) : item.pagemap?.cse_image?.[0]?.src ? (
                                        <img
                                            src={item.pagemap.cse_image[0].src}
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
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={classes.resultLink}
                                    >
                                        To Product →
                                    </a>
                                </section>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GoogleSearch;