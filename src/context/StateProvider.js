import React, { createContext, useReducer, useContext } from 'react'
import { initialState, reducer } from './reducer'

const StateContext = createContext()

export const useAppContext = () => useContext(StateContext)

export const StateProvider = ({children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)