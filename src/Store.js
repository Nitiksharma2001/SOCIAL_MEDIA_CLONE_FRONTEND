import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./features/UserSlice"
import postReducer from "./features/PostSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    post: postReducer
  }
})