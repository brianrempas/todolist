import { configureStore } from '@reduxjs/toolkit'
import counterReduxer from './counterSlice'
import counterReduxerList from './counterSliceList'

export default configureStore({
  reducer: {
    counter: counterReduxer,
    counterList:  counterReduxerList
  },
})