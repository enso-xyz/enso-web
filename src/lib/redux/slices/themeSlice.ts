import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  systemTheme: 'light' | 'dark'
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) return savedTheme
  }
  return 'system'
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
  systemTheme: 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
    },
    setSystemTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemTheme = action.payload
    },
  },
})

export const { setTheme, setSystemTheme } = themeSlice.actions

export const selectTheme = (state: { theme: ThemeState }) => {
  return state.theme.theme === 'system' ? state.theme.systemTheme : state.theme.theme
}

export default themeSlice.reducer 