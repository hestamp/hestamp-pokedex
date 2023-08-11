import React from 'react'
import styles from './MyDropdown.module.css'
const MyDropdown = ({ handleTypeSelect, array, selectedType, all }) => {
  return (
    <div className={styles.typeFilter}>
      <select
        value={selectedType}
        onChange={(e) => handleTypeSelect(e.target.value)}
      >
        <option value="">{all}</option>
        {array.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MyDropdown
