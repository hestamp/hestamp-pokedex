import { createSlice } from '@reduxjs/toolkit'

const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    pokemonArray: [],
    currentPokemon: null,
  },
  reducers: {
    uPokemonArray: (state, action) => {
      state.pokemonArray = action.payload
    },
    uCurrentPokemon: (state, action) => {
      state.currentPokemon = action.payload
    },
  },
})

export const { uPokemonArray, uCurrentPokemon } = tempSlice.actions
export default tempSlice.reducer
