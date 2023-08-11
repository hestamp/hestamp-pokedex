// VerticalProgressBar.js
import React from 'react'
import styles from './ProgressBar.module.css'

const ProgressBar = ({ ourNum, max, label }) => {
  const progress = (ourNum / max) * 100
  const isLow = () => {
    return progress < 50 ? 'red' : 'teal'
  }
  return (
    <div className={styles.fullBlock}>
      <h4 className={styles.label}>{label}</h4>
      <h4>{ourNum}</h4>
      <div className={styles.toolbar}>
        <div
          className={styles.progress}
          style={{ width: `${progress}%`, backgroundColor: `${isLow()}` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
