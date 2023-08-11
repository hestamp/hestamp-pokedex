import React, { useEffect } from 'react'
import styles from './OnePokemon.module.css'
import NameAndBack from '../../components/Navbar/Tools/NameAndBack/NameAndBack'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PokeBlock from '../../components/PokeBlock/PokeBlock'
const OnePokemon = () => {
  const { currentPokemon } = useSelector((state) => state.temp)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentPokemon) {
      navigate('/')
    }
  }, [])

  return (
    <div className={styles.onePage}>
      {currentPokemon ? (
        <>
          <NameAndBack />
          <PokeBlock />
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default OnePokemon
