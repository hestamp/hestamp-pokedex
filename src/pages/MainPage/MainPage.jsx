import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.css'
import MyLoader from '../../components/Navbar/Tools/MyLoader/MyLoader'
import myAxios from '../../axios'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  uCurrentPokemon,
  uIsErr,
  uLoadCount,
  uPokeTypes,
  uPokemonArray,
} from '../../store/tempSlice'
import MyDropdown from '../../components/Navbar/Tools/MyDropdown/MyDropdown'
import MyCheckbox from '../../components/Navbar/Tools/MyCheckbox/MyCheckbox'
import { useNavigate } from 'react-router-dom'
import { repoGif, sortMode, typeColors } from '../../components/static/data'
import { getTypeColor } from '../../components/functions'
import PokeBlock from '../../components/PokeBlock/PokeBlock'
const MainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const limit = 16

  const [pickedPokemon, setPickedPokemon] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [isChecked, setIsChecked] = useState(true)
  const [filteredArray, setFilteredArray] = useState([])

  const handleCheckboxChange = (value) => {
    setIsChecked(value)
  }

  const { pokemonArray, currentPokemon, isErr, pokeTypes, loadCount } =
    useSelector((state) => state.temp)

  const clickItem = (item, pokeId, poke) => {
    if (pickedPokemon === item) {
      setPickedPokemon(null)

      dispatch(uCurrentPokemon(null))
    } else {
      setPickedPokemon(item)

      dispatch(uCurrentPokemon(poke))
    }

    if (window.innerWidth <= 1200) {
      navigate(`/pokemon/${pokeId}`)
    }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    onTypeSelect(type)
  }

  const onTypeSelect = (item) => {
    const filteredArr = pokemonArray.filter((pokemon) => {
      if (pokemon.types) {
        return pokemon.types.some((type) => item == type)
      }
      return false
    })
    setFilteredArray(filteredArr)
  }

  const getAllPokemons = async () => {
    let updatedArray
    try {
      setIsLoading(true)
      const response = await myAxios.get(
        `pokemon/?limit=${limit}&offset=${loadCount * 16}`
      )

      if (response.data) {
        const fetchedPokemonArray = response.data.results
        const updatedPokemonArray = fetchedPokemonArray.map((pokemon) => ({
          ...pokemon,
          rest: null,
        }))

        updatedArray = [...pokemonArray, ...updatedPokemonArray]

        await Promise.all(
          updatedPokemonArray.map(async (pokemon) => {
            try {
              const pokemonResponse = await axios.get(pokemon.url)

              const names = pokemonResponse.data.types.map(
                ({ type }) => type.name
              )

              const updatedPokemon = {
                ...pokemon,
                types: names,
                rest: pokemonResponse.data,
              }

              const lastUpdateArr = updatedArray.map((prevPokemon) =>
                prevPokemon.url === pokemon.url ? updatedPokemon : prevPokemon
              )

              updatedArray = lastUpdateArr
            } catch (error) {
              console.error('some error, sorry', error)
            }
          })
        )
      }
    } catch (error) {
      if (error) {
        dispatch(uIsErr(true))
      }
    } finally {
      setIsLoading(false)
      dispatch(uLoadCount(loadCount + 1))

      if (selectedType != '') {
        handleTypeSelect(selectedType)
      }
      dispatch(uPokemonArray(updatedArray))
    }
  }

  const clickTag = (e, tag) => {
    e.stopPropagation()
    handleTypeSelect(tag)
  }

  const getTypes = async () => {
    try {
      const response = await myAxios.get(`type?limit=999`)

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

  const resetTypes = () => {
    setSelectedType('')
  }

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
            <div className={styles.dropBlock}>
              <MyDropdown
                handleTypeSelect={handleTypeSelect}
                selectedType={selectedType}
                array={pokeTypes}
                all="TYPE"
              />
              {/* <MyDropdown
                handleTypeSelect={handleTypeSelect}
                selectedType={selectedType}
                array={sortMode}
                all="SORT"
              /> */}
            </div>
          )}
          <MyCheckbox
            label="Animated"
            value={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className={styles.allPokemons}>
          {!isErr &&
          pokemonArray.length &&
          filteredArray.length == 0 &&
          selectedType == '' ? (
            pokemonArray.map((poke, id) => {
              const pokeId = extractIdFromUrl(poke.url) || null

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
                    {isChecked ? (
                      <img
                        className={styles.pokeGif}
                        src={`${repoGif}${pokeId}.gif`}
                      />
                    ) : (
                      <img
                        className={styles.pokeImg}
                        src={poke.rest.sprites.other.home.front_default}
                      />
                    )}
                  </div>
                  {poke.rest ? (
                    <div className={styles.tagsBlock}>
                      {poke.rest.types.map((type) => {
                        const colorPick = getTypeColor(type.type.name)
                        return (
                          <p
                            style={{
                              backgroundColor: colorPick,
                            }}
                            onClick={(e) => clickTag(e, type.type.name)}
                            className={styles.oneTag}
                            key={type.type.name}
                          >
                            {type.type.name}
                          </p>
                        )
                      })}
                    </div>
                  ) : (
                    <div className={styles.loaderDiv}>
                      <MyLoader />
                    </div>
                  )}
                </div>
              )
            })
          ) : !isErr && filteredArray.length ? (
            filteredArray.map((poke, id) => {
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
                    {isChecked ? (
                      <img
                        className={styles.pokeGif}
                        src={`${repoGif}${pokeId}.gif`}
                      />
                    ) : (
                      <img
                        className={styles.pokeImg}
                        src={poke.rest.sprites.other.dream_world.front_default}
                      />
                    )}
                  </div>
                  {poke.rest ? (
                    <div className={styles.tagsBlock}>
                      {poke.rest.types.map((type) => {
                        const colorPick = getTypeColor(type.type.name)
                        return (
                          <p
                            style={{
                              backgroundColor: colorPick,
                            }}
                            onClick={(e) => clickTag(e, type.type.name)}
                            className={styles.oneTag}
                            key={type.type.name}
                          >
                            {type.type.name}
                          </p>
                        )
                      })}
                    </div>
                  ) : (
                    <div className={styles.loaderDiv}>
                      <MyLoader />
                    </div>
                  )}
                </div>
              )
            })
          ) : selectedType != '' && filteredArray.length == 0 ? (
            <>
              <h3 className={styles.noFlex}>No loaded pokemons this type</h3>
              <button onClick={resetTypes} className={styles.myButtReset}>
                Reset
              </button>
            </>
          ) : isErr ? (
            <p>Some error, please reload page</p>
          ) : (
            <></>
          )}
        </div>
        {isLoading && <MyLoader />}
        <button className={styles.myButt} onClick={getAllPokemons}>
          Load More
        </button>
      </div>
      <div className={styles.onePokemon}>
        <div className={styles.oneContainer}>
          {currentPokemon ? (
            <PokeBlock />
          ) : (
            <div className={styles.midDiv}>
              {' '}
              <h3>Who is your pokemon?</h3>
              <img className={styles.pokeImgWide} src="images/pokemon.webp" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainPage
