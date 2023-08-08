import React from 'react'
import styles from './Navbar.module.css'
const Navbar = ({ context }) => {
  return (
    <div className={styles.navbar}>{context ? context : <h1>Pokedex</h1>}</div>
  )
}

export default Navbar
