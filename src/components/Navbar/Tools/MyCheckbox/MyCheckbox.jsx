import React from 'react'
import styles from './MyCheckbox.module.css'
const MyCheckbox = ({ label, value, onChange, abbrTxt, abrFull }) => {
  const handleCheckboxChange = () => {
    const updatedValue = !value
    onChange(updatedValue)
  }

  return (
    <label className={styles.myCheckbox}>
      {label}
      <input type="checkbox" checked={value} onChange={handleCheckboxChange} />
      {abbrTxt && <abbr title={abrFull}>{abbrTxt}</abbr>}
    </label>
  )
}

export default MyCheckbox
