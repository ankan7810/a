import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Export the actions
export const { setLoading, setUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Export the authSlice if needed
export const authSliceReducer = authSlice.reducer;




// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     loading: false,
//     user: null,
//     token: null, // ✅ add token field
//   },
//   reducers: {
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.loading = false;
//     },
//   },
// });

// export const { setLoading, setUser, setToken, logout } = authSlice.actions;
// export default authSlice.reducer;
// export const authSliceReducer = authSlice.reducer;
