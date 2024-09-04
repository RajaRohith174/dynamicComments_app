import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface commentState {
  isMainCameraOpen: boolean;
}

const initialState: commentState = {
  isMainCameraOpen: false,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder;
  },
});

export const {} = commentSlice.actions;
export default commentSlice.reducer;
