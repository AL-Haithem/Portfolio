import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills/Skills'
import Works from './components/Works'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorGlow from './components/ui/CursorGlow'
import AuthModal from './components/AuthModal'
import NotFound from './NotFound.jsx'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <BrowserRouter>

      <CursorGlow />

        <Routes>

          <Route path="/" element={
            <main id="home">
              <Navbar />
              <Hero />
              <Works onOpenAuth={() => setAuthOpen(true)} />
              <Skills />
              <About />
              <Journey />
              <Contact />
            </main>
          }/>

          <Route path="*" element={<NotFound />} />  
        </Routes>

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

    </BrowserRouter>
  )
}
