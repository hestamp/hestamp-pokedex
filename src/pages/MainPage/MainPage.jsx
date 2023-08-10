import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.css'
import MyLoader from '../../components/Navbar/Tools/MyLoader/MyLoader'
import myAxios from '../../axios'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  uCurrentPokemon,
  uIsErr,
  uPokeTypes,
  uPokemonArray,
} from '../../store/tempSlice'
import MyDropdown from '../../components/Navbar/Tools/MyDropdown/MyDropdown'
import MyCheckbox from '../../components/Navbar/Tools/MyCheckbox/MyCheckbox'
import { useNavigate } from 'react-router-dom'
const MainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const limit = 16
  const [loadedTimes, setLoadedTimes] = useState(0)
  const [pickedPokemon, setPickedPokemon] = useState(null)
  const [pickedId, setPickedId] = useState(null)
  const [currentPoke, setCurrentPoke] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [isChecked, setIsChecked] = useState(true)
  const [filteredArray, setFilteredArray] = useState([])

  const handleCheckboxChange = (value) => {
    setIsChecked(value)
  }

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A8A8',
      fighting: '#D67873',
      flying: '#83A2E3',
      poison: '#C183C1',
      ground: '#E0C791',
      rock: '#C9BB8A',
      bug: '#C2D21F',
      ghost: '#8571BE',
      steel: '#CCCCCC',
      fire: '#FF9A58',
      water: '#6A92E3',
      grass: '#79C957',
      electric: '#FFD54F',
      psychic: '#FF80B2',
      ice: '#AEE3FF',
      dragon: '#8A75FF',
      dark: '#8E8E99',
      fairy: '#FFA1E3',
      unknown: '#B0B0B0',
      shadow: '#6B6B6B',
    }

    const typeNameLower = typeName.toLowerCase()
    return typeColors[typeNameLower] || null
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
      dispatch(uCurrentPokemon(null))
    } else {
      setPickedPokemon(item)
      setPickedId(pokeId)
      setCurrentPoke(poke)
      dispatch(uCurrentPokemon(poke))
    }

    if (window.innerWidth <= 1200) {
      //
      navigate(`/pokemon/${pokeId}`)
    }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    console.log(type)
    onTypeSelect(type)
  }

  const onTypeSelect = (item) => {
    const filteredArr = pokemonArray.filter((pokemon) => {
      if (pokemon.types) {
        return pokemon.types.some((type) => item == type)
      }
      return false
    })
    console.log(filteredArr)
    setFilteredArray(filteredArr)
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

              dispatch(uPokemonArray(lastUpdateArr))
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
      setLoadedTimes((prev) => prev + 1)
      if (selectedType != '') {
        handleTypeSelect(selectedType)
      }
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
            <MyDropdown
              handleTypeSelect={handleTypeSelect}
              selectedType={selectedType}
              pokeTypes={pokeTypes}
            />
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
