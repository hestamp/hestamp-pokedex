import React from 'react'
import styles from './MyDropdown.module.css'
const MyDropdown = ({ handleTypeSelect, pokeTypes, selectedType }) => {
  return (
    <div className={styles.typeFilter}>
      <select
        value={selectedType}
        onChange={(e) => handleTypeSelect(e.target.value)}
      >
        <option value="">All</option>
        {pokeTypes.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MyDropdown
