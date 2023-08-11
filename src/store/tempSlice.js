import { createSlice } from '@reduxjs/toolkit'

const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    pokemonArray: [],
    currentPokemon: null,
    isErr: null,
    pokeTypes: null,
    loadCount: 0,
  },
  reducers: {
    uPokemonArray: (state, action) => {
      state.pokemonArray = action.payload
    },
    uCurrentPokemon: (state, action) => {
      state.currentPokemon = action.payload
    },
    uIsErr: (state, action) => {
      state.isErr = action.payload
    },
    uLoadCount: (state, action) => {
      state.loadCount = action.payload
    },
    uPokeTypes: (state, action) => {
      state.pokeTypes = action.payload
    },
  },
})

export const {
  uPokemonArray,
  uCurrentPokemon,
  uIsErr,
  uLoadCount,
  uPokeTypes,
} = tempSlice.actions
export default tempSlice.reducer
