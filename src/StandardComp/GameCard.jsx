import "../CompCss/Games.css"
import { Link } from "react-router"

const STEAM_APP_URL = "https://store.steampowered.com/app"
const STEAM_ASSET_BASE = "https://shared.akamai.steamstatic.com/"

export function steamAssetUrl(value) {
    if (!value || typeof value !== "string") return ""
    if (value.startsWith("https://")) return value
    return STEAM_ASSET_BASE + value.replace(/^\/+/, "")
}

function formatReleaseDate(rel) {
    if (rel?.coming_soon) return rel.date ? `Coming soon: ${rel.date}` : "Coming soon"
    if (!rel?.date) return null

    const date = new Date(rel.date)
    if (Number.isNaN(date.getTime())) return rel.date

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

function formatPrice(price) {
    if (!price?.final || price.final <= 0) return null

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency || "USD"
    }).format(price.final / 100)
}

export function GameCard({
    steam_appid,
    name,
    title,
    head,
    is_free,
    Price,
    rel,
    recs
}) {
    const gameData = { steam_appid, name, title, head, is_free, Price, rel, recs }
    const reviews = recs?.total || 0
    const gameName = name || title || "Untitled"
    const usPrice = Price?.US
    const releaseText = formatReleaseDate(rel)
    const hasBuyablePrice = !is_free && !rel?.coming_soon && usPrice?.final > 0
    const steamUrl = `${STEAM_APP_URL}/${steam_appid}`
    const detailsUrl = `/games/${steam_appid}`
    const priceText = rel?.coming_soon
        ? releaseText
        : is_free
            ? "Free"
            : formatPrice(usPrice) || "Unavailable"

    return (
        <article className="game-card">
            {reviews > 50000 && <div className="player-count">Popular</div>}

            <img src={steamAssetUrl(head)} alt={gameName} loading="lazy" />

            <div className="game-info">
                <h3 className="game-card-title">{gameName}</h3>
                {releaseText && !rel?.coming_soon && <div className="game-meta">Release date: {releaseText}</div>}

                <div className="price-row">
                    <span className="game-price">{priceText}</span>

                    <div className="game-actions">
                        {hasBuyablePrice && (
                            <button className="cart-btn" type="button" title="Add to cart">
                                <i className="fas fa-cart-plus"></i>
                            </button>
                        )}

                        {hasBuyablePrice ? (
                            <Link to={detailsUrl} state={{ game: gameData }} className="buy-btn">Buy</Link>
                        ) : (
                            <a href={steamUrl} className="buy-btn steam-btn" target="_blank" rel="noreferrer">
                                Steam
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
