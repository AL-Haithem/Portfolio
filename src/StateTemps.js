export const FiltersObjs = [
    { id: 1, active: true, filter: "popular", text: "Most Popular 🔥" },
    { id: 2, active: false, filter: "paid", text: "Paid Games 💰" },
    { id: 3, active: false, filter: "lowest", text: "Lowest Price 📉" },
    { id: 4, active: false, filter: "free", text: "Free 🎁" },
    { id: 5, active: false, filter: "recent", text: "Newest 🆕" },
]

export const NavBarObjs = [
    { id: 1, Redirect: "/", active: false, text: "Home", emo: "🏠" },
    { id: 2, Redirect: "/games", active: true, text: "Store", emo: "🎮" },
    { id: 3, Redirect: "/", active: false, text: "Top Up", emo: "💳" },
    { id: 4, Redirect: "/", active: false, text: "Support", emo: "🛠️" },
]

export const storeCards = [
    { icon: "fa-brands fa-steam", title: "PC / Steam Games", desc: "Latestreleases and global games at competitive prices with fast delivery" },
    { icon: "fa-credit-card", title: "Secure Local Payments", desc: "Flexible payment options for a simple and reliable checkout experience" },
    { icon: "fa-gift", title: "Exclusive Deals", desc: "Save on top games and discover fresh offers across the store" }
]

export const servicesCards = [
    { icon: "fa-gem", title: "Currency Top Ups", desc: "Coming soon" },
    { icon: "fa-user-shield", title: "Premium Accounts", desc: "Reliable ready-to-use accounts at competitive prices" }
]
