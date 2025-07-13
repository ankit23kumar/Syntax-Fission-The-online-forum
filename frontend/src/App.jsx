import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
    <Router>
      <Navbar />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
    </Router>
    </>
    
  )
}

export default App
