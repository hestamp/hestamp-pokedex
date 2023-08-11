import React from 'react'
import styles from './PokeBlock.module.css'
import { getTypeColor } from '../functions'
import { useSelector } from 'react-redux'
import ProgressBar from '../Navbar/Tools/ProgressBar/ProgressBar'
const PokeBlock = () => {
  const { currentPokemon } = useSelector((state) => state.temp)

  const shortMe = (name) => {
    if (name.length > 8) {
      return name
        .split('-')
        .map((part) => part.substring(0, 2))
        .join('. ')
    }
    return name
  }

  const calculateTotal = (stats) => {
    return stats.reduce((total, item) => total + item.base_stat, 0)
  }
  return (
    <div className={styles.roundDiv}>
      <div className={styles.nameNum}>
        <h2>{currentPokemon.name}</h2>
        <h4>#{currentPokemon.rest.id}</h4>
      </div>
      <div className={styles.tagMe}>
        {currentPokemon && (
          <div className={styles.tagsBlock}>
            {currentPokemon.rest.types.map((type) => {
              const colorPick = getTypeColor(type.type.name)
              return (
                <p
                  style={{
                    backgroundColor: colorPick,
                  }}
                  className={styles.oneTag}
                  key={type.type.name}
                >
                  {type.type.name}
                </p>
              )
            })}
          </div>
        )}
      </div>
      <div className={styles.imgDiv}>
        <img
          className={styles.pokeImgWide}
          src={currentPokemon.rest.sprites.other.dream_world.front_default}
        />
      </div>
      <div className={styles.infoDiv}>
        <div className={styles.statBlock}>
          {currentPokemon.rest.stats.map((item) => {
            const newName =
              item.stat.name.length > 8
                ? shortMe(item.stat.name)
                : item.stat.name
            return (
              <ProgressBar
                key={item.stat.name}
                label={newName}
                ourNum={item.base_stat}
                max={100}
              />
            )
          })}
          <ProgressBar
            label="Total"
            ourNum={calculateTotal(currentPokemon.rest.stats)}
            max={600}
          />
        </div>
      </div>
    </div>
  )
}

export default PokeBlock
