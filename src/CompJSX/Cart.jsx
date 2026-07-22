import { Link } from "react-router"
import "../CompCss/Cart.css"

export default function CartPage() {
    return (
        <>
            <header className="cart-header">
                <Link to="/games" className="btn-back"><i className="fas fa-arrow-left"></i> Back to Store</Link>
                <div className="header-title">
                    <i className="fas fa-shopping-cart"></i>
                    <h1>Shopping Cart</h1>
                </div>
                <div className="header-placeholder"></div>
            </header>

            <main className="cart-main">
                <div id="emptyCart" className="empty-cart">
                    <div className="empty-icon">Cart</div>
                    <h2>Your cart is empty</h2>
                    <p>You have not added any games yet.</p>
                    <Link to="/games" className="btn-browse">Browse Games</Link>
                </div>

                <div id="cartContent">
                    <div className="cart-layout">
                        <div className="cart-items" id="cartItems"></div>

                        <div className="cart-summary">
                            <h2 className="summary-title">Order Summary</h2>
                            <div className="summary-row">
                                <span>Games:</span>
                                <span id="totalCount">0</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span id="totalPrice">$0.00</span>
                            </div>

                            <button id="checkoutWhatsapp" className="checkout-btn whatsapp-btn" type="button">
                                <i className="fab fa-whatsapp"></i>
                                Order via WhatsApp
                            </button>
                            <button className="checkout-btn clear-btn" type="button">
                                <i className="fas fa-trash"></i>
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
