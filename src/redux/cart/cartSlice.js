import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: 0,
}

export const cartSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        clear: (state) => {
            state.value = 0
        },
        setCartLength: (state, action) => {
            state.value = action.payload; // Set the cart length dynamically
        },
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, clear,setCartLength } = cartSlice.actions

export default cartSlice.reducer
