import { createSlice } from '@reduxjs/toolkit'

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    value: []
  },
  reducers: {
    setPost: (state, action) => {
        state.value = action.payload
    },
    addPost: (state, action) => {
      state.value = [...state.value, action.payload]
    },
  }
})

export const { setPost, addPost } = postSlice.actions

export default postSlice.reducer