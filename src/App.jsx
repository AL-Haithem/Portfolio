import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import './App.css'

import LandingPage from './CompJSX/Landing.jsx'
import GamesPage from './CompJSX/Games.jsx'
import CartPage from './CompJSX/Cart.jsx'
import DetailsPage from './CompJSX/Details.jsx'
import NotFound from './NotFound.jsx'
import AdminLogin from './CompJSX/AdminLogin.jsx'
import AdminDashboard from './AdminPanel/AdminDashboard.jsx'
import ClientAuth from './CompJSX/ClientAuth.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<ClientAuth />} />

        <Route path="/games" >
          <Route index element={<GamesPage />} />
          <Route path=":appId" element={<DetailsPage />} />
          <Route path="buy" element={<GamesPage />} />
        </Route>

        <Route path="/admin/login"     element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
