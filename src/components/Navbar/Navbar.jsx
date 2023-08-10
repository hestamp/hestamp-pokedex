import React from 'react'
import styles from './Navbar.module.css'
import { useNavigate } from 'react-router-dom'
const Navbar = ({ context }) => {
  const navigate = useNavigate()
  return (
    <div className={styles.navbar}>
      {context ? context : <h1 onClick={() => navigate('/')}>PokeStamp</h1>}
    </div>
  )
}

export default Navbar
