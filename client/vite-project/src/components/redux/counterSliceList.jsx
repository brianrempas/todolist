import { createSlice } from '@reduxjs/toolkit'

export const counterSliceList = createSlice({
  name: 'counterList',
  initialState: {
    inputValues: '',
    inputValuesDate: ''
  },
  
  reducers: {
    setInputValues: (state, action) => {
      state.inputValues = action.payload;
    },
    setInputValuesDate: (state, action) => {
      state.inputValuesDate = action.payload;
    },
  },

})

export const {
    setInputValues,
    setInputValuesDate,
  } = counterSliceList.actions;

export default counterSliceList.reducer