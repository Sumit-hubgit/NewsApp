import React, { useEffect, useState } from 'react';
import './App.css'; // Import your CSS file

// Define your API key and base URL for fetching news
const API_KEY = "8f45f7ab4be548f2b68586715072bc00";
const url = "https://newsapi.org/v2/everything?q=";

const NewsApp = () => {
    // State for storing fetched news articles
    const [articles, setArticles] = useState([]);
    // State for managing the current news category or search term
    const [currentQuery, setCurrentQuery] = useState("India");
    // State for managing which category is active
    const [activeNav, setActiveNav] = useState(null);
    // State for handling the input of the search term
    const [searchTerm, setSearchTerm] = useState("");
    // State for loading status
    const [isLoading, setIsLoading] = useState(false);
    // State for pagination
    const [page, setPage] = useState(1);
    // State to store saved favorite articles
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
    // State for error handling
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNews(currentQuery);
    }, [currentQuery, page]);

    // Function to fetch news articles
    const fetchNews = async (query) => {
        setIsLoading(true); // Start loading
        setError(""); // Reset any previous errors
        try {
            const res = await fetch(`${url}${query}&apiKey=${API_KEY}&page=${page}&pageSize=10`); // Fetch paginated news
            const data = await res.json();
            if (data.articles) {
                setArticles(data.articles);
            } else {
                throw new Error(data.message || "Failed to fetch news");
            }
        } catch (err) {
            setError(err.message); // Set error message if API fails
        }
        setIsLoading(false); // Stop loading after fetching
    };

    // Handle navigation link clicks
    const handleNavItemClick = (id) => {
        setCurrentQuery(id); // Update query to fetch relevant news
        setActiveNav(id); // Set active category for highlighting
        setPage(1); // Reset to page 1 on category change
    };

    // Handle search functionality
    const handleSearch = () => {
        if (searchTerm) {
            setCurrentQuery(searchTerm);
            setActiveNav(null); // Remove active highlight from categories
            setPage(1); // Reset to page 1 on search
        }
    };

    // Save an article to favorites
    const saveToFavorites = (article) => {
        const newFavorites = [...favorites, article];
        setFavorites(newFavorites); // Update the favorites list
        localStorage.setItem('favorites', JSON.stringify(newFavorites)); // Save to local storage
    };

    // Remove an article from favorites
    const removeFromFavorites = (url) => {
        const updatedFavorites = favorites.filter(article => article.url !== url);
        setFavorites(updatedFavorites); // Update the favorites list
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    };

    return (
        <div>
            {/* Navigation bar containing category links and search bar */}
            <nav>
                <div className="main-nav container flex">
                    <div className="nav-links">
                        {/* Category links */}
                        <ul className="flex">
                            <li className={`hover-link nav-item ${activeNav === 'ipl' ? 'active' : ''}`} onClick={() => handleNavItemClick('ipl')}>IPL</li>
                            <li className={`hover-link nav-item ${activeNav === 'finance' ? 'active' : ''}`} onClick={() => handleNavItemClick('finance')}>Finance</li>
                            <li className={`hover-link nav-item ${activeNav === 'politics' ? 'active' : ''}`} onClick={() => handleNavItemClick('politics')}>Politics</li>
                        </ul>
                    </div>
                    {/* Search bar */}
                    <div className="search-bar flex">
                        <input
                            type="text"
                            className="news-input"
                            placeholder="e.g. Science"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </nav>

            {/* Main section */}
            <main>
                {/* Show loading spinner */}
                {isLoading && <div className="loading">Loading...</div>}
                {/* Show error message if there's an error */}
                {error && <div className="error">{error}</div>}

                {/* Display news cards */}
                <div className="cards-container container flex">
                    {!isLoading && articles.map((article, index) => (
                        article.urlToImage && (
                            <div className="card" key={index} onClick={() => window.open(article.url, "_blank")}>
                                <div className="card-header">
                                    <img src={article.urlToImage} alt="news" />
                                </div>
                                <div className="card-content">
                                    <h3>{article.title}</h3>
                                    <h6 className="news-source">
                                        {`${article.source.name} · ${new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}`}
                                    </h6>
                                    <p className="news-desc">{article.description}</p>
                                    <button onClick={() => saveToFavorites(article)}>Save to Favorites</button>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Pagination buttons */}
                <div className="pagination">
                    <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>Previous</button>
                    <span>Page {page}</span>
                    <button onClick={() => setPage(page + 1)}>Next</button>
                </div>

                {/* Display saved favorites */}
                <div className="favorites-section">
                    <h2>Favorite Articles</h2>
                    <div className="favorites-container">
                        {favorites.map((article, index) => (
                            <div className="favorite-card" key={index}>
                                <h4>{article.title}</h4>
                                <button onClick={() => removeFromFavorites(article.url)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewsApp;
