import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.css'
import MyLoader from '../../components/Navbar/Tools/MyLoader/MyLoader'
import myAxios from '../../axios'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { uIsErr, uPokeTypes, uPokemonArray } from '../../store/tempSlice'
import MyDropdown from '../../components/Navbar/Tools/MyDropdown/MyDropdown'
import MyCheckbox from '../../components/Navbar/Tools/MyCheckbox/MyCheckbox'
const MainPage = () => {
  const dispatch = useDispatch()
  const limit = 16
  const [loadedTimes, setLoadedTimes] = useState(0)
  const [pickedPokemon, setPickedPokemon] = useState(null)
  const [pickedId, setPickedId] = useState(null)
  const [currentPoke, setCurrentPoke] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (value) => {
    setIsChecked(value)
  }

  const repoGif =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/'

  const { pokemonArray, currentPokemon, isErr, pokeTypes } = useSelector(
    (state) => state.temp
  )

  const clickItem = (item, pokeId, poke) => {
    if (pickedPokemon === item) {
      setPickedPokemon(null)
      setPickedId(null)
      setCurrentPoke(null)
    } else {
      setPickedPokemon(item)
      setPickedId(pokeId)
      setCurrentPoke(poke)
    }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    // onTypeSelect(type)
  }

  const getAllPokemons = async () => {
    try {
      setIsLoading(true)
      const response = await myAxios.get(
        `pokemon/?limit=${limit}&offset=${loadedTimes * 16}`
      )

      if (response.data) {
        const fetchedPokemonArray = response.data.results
        const updatedPokemonArray = fetchedPokemonArray.map((pokemon) => ({
          ...pokemon,
          rest: null,
        }))

        let updatedArray = [...pokemonArray, ...updatedPokemonArray]

        dispatch(uPokemonArray(updatedArray))

        await Promise.all(
          updatedPokemonArray.map(async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url)

            const updatedPokemon = {
              ...pokemon,
              rest: pokemonResponse.data,
            }

            const lastUpdateArr = updatedArray.map((prevPokemon) =>
              prevPokemon.url === pokemon.url ? updatedPokemon : prevPokemon
            )

            updatedArray = lastUpdateArr

            dispatch(uPokemonArray(lastUpdateArr))
          })
        )
      }
    } catch (error) {
      if (error) {
        dispatch(uIsErr(true))
      }
    } finally {
      setIsLoading(false)
      setLoadedTimes((prev) => prev + 1)
    }
  }

  const clickTag = (e, tag) => {
    e.stopPropagation()
    console.log(tag)
  }

  const getTypes = async () => {
    try {
      const response = await myAxios.get(`type?limit=999`)
      console.log(response.data.results)
      if (response) {
        dispatch(uPokeTypes(response.data.results))
      }
    } catch (error) {
      dispatch(uIsErr(true))
    }
  }

  useEffect(() => {
    if (pokemonArray.length < 10) {
      getAllPokemons()
    }

    if (!pokeTypes) {
      getTypes()
    }
  }, [])

  function extractIdFromUrl(url) {
    const match = url.match(/\/(\d+)\/$/)
    if (match) {
      return parseInt(match[1])
    }
    return null
  }

  return (
    <div className={styles.mainPage}>
      <div className={styles.gridNbutt}>
        <div className={styles.filterSetting}>
          {pokeTypes && (
            <MyDropdown
              handleTypeSelect={handleTypeSelect}
              selectedType={selectedType}
              pokeTypes={pokeTypes}
            />
          )}
          <MyCheckbox
            label="Animated"
            value={isChecked}
            abrFull="Gif animations can load GPU of your device"
            abbrTxt="Why?"
            onChange={handleCheckboxChange}
          />
        </div>
        <div className={styles.allPokemons}>
          {!isErr && pokemonArray.length ? (
            pokemonArray.map((poke, id) => {
              const pokeId = extractIdFromUrl(poke.url)

              return (
                <div
                  onClick={() => clickItem(id, pokeId, poke)}
                  className={`${styles.pokeBlock} ${
                    pickedPokemon == id && styles.pickedBlock
                  }`}
                  key={id}
                >
                  <div className={styles.nameAndTag}>
                    <h3>{poke.name}</h3>
                  </div>
                  <div className={styles.imgDiv}>
                    <img
                      className={styles.pokeImg}
                      src={`${repoGif}${pokeId}.gif`}
                    />
                  </div>
                  {poke.rest ? (
                    <div className={styles.tagsBlock}>
                      {poke.rest.types.map((type) => (
                        <p
                          onClick={(e) => clickTag(e, type.type.name)}
                          className={styles.oneTag}
                          key={type.type.name}
                        >
                          {type.type.name}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.loaderDiv}>
                      <MyLoader />
                    </div>
                  )}
                </div>
              )
            })
          ) : isErr ? (
            <p>Some error, please reload page</p>
          ) : (
            <MyLoader />
          )}
        </div>
        {isLoading && <MyLoader />}
        <button className={styles.myButt} onClick={getAllPokemons}>
          Load More
        </button>
      </div>
      <div className={styles.onePokemon}>
        <div className={styles.oneContainer}>
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
