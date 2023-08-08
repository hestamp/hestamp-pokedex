import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import styles from './App.module.css'
import MainPage from './pages/MainPage/MainPage'
import OnePokemon from './pages/OnePokemon/OnePokemon'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.section1}>
        <Navbar />
      </div>
      <div className={styles.section2}>
        <Routes>
          {/* Main> */}
          <Route exact path="/" element={<MainPage />} />

          <Route path="/pokemon/:name" element={<OnePokemon />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
