import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lecturerCoursesMenuItems: []
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setLecturerCoursesMenuItems: (state, action) => {
      state.lecturerCoursesMenuItems = action.payload;
    }
  }
});

export const { setLecturerCoursesMenuItems } = courseSlice.actions;
export default courseSlice.reducer; 