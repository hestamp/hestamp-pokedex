import { configureStore } from '@reduxjs/toolkit'

import tempReducer from './tempSlice'

export default configureStore({
  reducer: {
    temp: tempReducer,
  },
})
