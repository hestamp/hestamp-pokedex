import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.css'
import MyLoader from '../../components/Navbar/Tools/MyLoader/MyLoader'
import axios from '../../axios'
import { useDispatch, useSelector } from 'react-redux'
import { uPokemonArray } from '../../store/tempSlice'
const MainPage = () => {
  const dispatch = useDispatch()
  const limit = 16
  const [loadedTimes, setLoadedTimes] = useState(0)
  const [pickedPokemon, setPickedPokemon] = useState(null)
  const [pickedId, setPickedId] = useState(null)

  const clickItem = (item, pokeId) => {
    if (pickedPokemon === item) {
      setPickedPokemon(null)
      setPickedId(null)
    } else {
      setPickedPokemon(item)
      setPickedId(pokeId)
    }
  }

  const repoGif =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/'
  const repoImg =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/'

  const { pokemonArray, currentPokemon } = useSelector((state) => state.temp)

  const getAllPokemons = async () => {
    const response = await axios.get(
      `/?limit=${limit}&offset=${loadedTimes * 16}`
    )
    console.log(response.data)
    if (response.data) {
      const newArr = [...pokemonArray, ...response.data.results]
      dispatch(uPokemonArray(newArr))
      setLoadedTimes((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (pokemonArray.length < 10) {
      getAllPokemons()
    }
  }, [])

  function extractIdFromUrl(url) {
    const match = url.match(/\/(\d+)\/$/)
    if (match) {
      return parseInt(match[1])
    }
    return null
  }

  const capFunc = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className={styles.mainPage}>
      <div className={styles.gridNbutt}>
        <div className={styles.allPokemons}>
          {pokemonArray.length &&
            pokemonArray.map((poke, id) => {
              const pokeId = extractIdFromUrl(poke.url)
              const capName = capFunc(poke.name)

              return (
                <div
                  onClick={() => clickItem(id, pokeId)}
                  className={`${styles.pokeBlock} ${
                    pickedPokemon == id && styles.pickedBlock
                  }`}
                  key={poke.name}
                >
                  <div className={styles.nameAndTag}>
                    <h3>{capName}</h3>
                  </div>
                  <div className={styles.imgDiv}>
                    <img
                      className={styles.pokeImg}
                      src={`${repoGif}${pokeId}.gif`}
                    />
                  </div>
                  {/* <div className={styles.tagsBLock}>
                  <p>cute</p>
                </div> */}
                  <div className={styles.loaderDiv}>
                    <MyLoader />
                  </div>
                </div>
              )
            })}
        </div>
        <button className={styles.myButt} onClick={getAllPokemons}>
          Load More
        </button>
      </div>
      <div className={styles.myButtDiv}>
        <div className={styles.goButt}>
          <div className={styles.roundDiv}>
            <p>Test me text{pickedPokemon}</p>
            <p>T{pickedId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
