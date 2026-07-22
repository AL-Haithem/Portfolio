import { useState, useEffect } from "react"
import axios from "axios"
import logo from "../assets/imgs/logo.png"
import "../CompCss/Games.css"
import { FilterButton, NavButton } from "../StandardComp/Buttons.jsx"
import { GameCard } from "../StandardComp/GameCard.jsx"
import { FiltersObjs, NavBarObjs } from "../StateTemps.js"
import { API_BASE } from "../api.js"

export default function GamesPage() {
    const [filters, setFilters] = useState(FiltersObjs)
    const [navFilter] = useState(NavBarObjs)
    const [isOpen, setIsOpen] = useState(false)
    const [gamesData, setGamesData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const activeFilter = filters.find(f => f.active)

    function toggleMenu() {
        setIsOpen(prev => !prev)
    }

    useEffect(() => {
        let isMounted = true

        const fetchGames = async () => {
            setIsLoading(true)
            setError("")

            try {
                const res = await axios.get(`${API_BASE}/api/public/games`, {
                    params: { page: 1, filter: activeFilter?.filter }
                })

                if (isMounted) setGamesData(res.data.data || [])
            } catch {
                if (isMounted) {
                    setGamesData([])
                    setError("Unable to load games")
                }
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        fetchGames()

        return () => {
            isMounted = false
        }
    }, [activeFilter?.id])
    return (
        <>
            <div className={`overlay ${isOpen ? "show" : ""}`} onClick={toggleMenu}></div>

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <div>
                        <div className="logo-circle">H</div>
                        <img src={logo} alt="Logo" />
                    </div>
                    <h3>Hnk Store</h3>
                    <button className="close-btn" onClick={toggleMenu}>x</button>
                </div>

                <nav>{navFilter.map((item) => (<NavButton key={item.id} {...item} />))}</nav>

                <div className="sidebar-footer">
                    <a href="/login" className="btn auth-btn-primary" style={{width: '100%', marginBottom: '15px', justifyContent: 'center'}}>
                        <i className="fa-solid fa-user"></i> My Account
                    </a>
                    <p>Version v1.0.0</p>
                </div>
            </div>

            <header className="header">
                <div className="header-left">
                    <div className="search-wrapper">
                        <span>Search</span>
                        <input
                            type="text"
                            className="search"
                            placeholder="Find your game..."
                        />
                    </div>

                    <a href="/cart" className="cart-icon">
                        <i className="fas fa-shopping-cart"></i>
                        <span id="cartBadge">0</span>
                    </a>
                </div>

                <div>
                    <div className="header-branding">
                        <img id="headerLogoImg" src={logo} alt="Logo" />
                        <div className="branding-text">
                            <div className="logo">Hnk Store</div>
                            <p className="site-mini-desc">Digital games at competitive prices</p>
                        </div>
                    </div>
                </div>

                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <a href="/login" className="user-icon-btn" style={{ color: '#fff', fontSize: '0.95rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: 600 }} title="Account">
                        <i className="fas fa-user" style={{ fontSize: '1.1rem' }}></i> <span className="account-text">My Account</span>
                    </a>
                    <button className="menu-btn" onClick={toggleMenu}>☰</button>
                </div>
            </header>

            <div className="filter-bar">
                {filters.map((filter) => (
                    <FilterButton
                        key={filter.id}
                        {...filter}
                        setFilterStatus={setFilters}
                        filters={filters}
                    />
                ))}
            </div>

            <section className="games">
                {isLoading && Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="game-card skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="game-info">
                            <div className="skeleton-title"></div>
                            <div className="price-row">
                                <div className="skeleton-price"></div>
                                <div className="skeleton-button"></div>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && error && <p className="games-message">{error}</p>}

                {!isLoading && !error && gamesData.map((game) => (
                    <GameCard key={game.steam_appid} {...game} />
                ))}

                {!isLoading && !error && gamesData.length === 0 && (
                    <p className="games-message">No games to display</p>
                )}
            </section>

            <div className="pagination-container">
                <div className="pagination-controls"></div>
            </div>
        </>
    )
}
