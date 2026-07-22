import "../CompCss/Games.css"
import { Link } from "react-router"

export function FilterButton({ id, text, active, filters, setFilterStatus }) {
    function handlebtn() {
        const updatedFilters = filters.map((filter) => ({ ...filter, active: filter.id === id }))
        setFilterStatus(updatedFilters)
    }

    return (
        <button className={`filter-btn ${active ? "active" : ""}`} onClick={handlebtn}>{text}</button>
    )
}

export function NavButton({ text, emo, active, Redirect }) {
    return (
        <Link to={Redirect} className={`nav-item ${active ? "active" : ""}`}>
            <span>{emo}</span> {text}
        </Link>
    )
}
