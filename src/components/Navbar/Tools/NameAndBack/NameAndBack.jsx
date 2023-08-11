import React from 'react'
import styles from './NameAndBack.module.css'
import { useNavigate } from 'react-router-dom'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
const NameAndBack = ({ pokeName }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.nameNback}>
      <button className={styles.backButt} onClick={() => navigate(-1)}>
        <MdOutlineArrowBackIosNew />
        {`BACK`}
      </button>
      <h3>{pokeName}</h3>
      <button
        style={{ opacity: 0 }}
        className={styles.backButt}
        onClick={() => navigate(-1)}
      >
        <MdOutlineArrowBackIosNew />
        {`BACK`}
      </button>
    </div>
  )
}

export default NameAndBack
