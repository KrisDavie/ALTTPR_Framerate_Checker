import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface TimerState {
  offset: number
  startTS: number
  status: "idle" | "running" | "stopped"
  sync: "local" | "ladder" | "racetime"
}

export const initialState: TimerState = {
  offset: 0,
  startTS: 0,
  status: "idle",
  sync: "local",
}

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    start: (state, action) => {
      if (state.status === "running") {
        return
      }
      state.status = "running"
      state.startTS = action.payload.startTS
      state.offset = action.payload.offset ?? 0
    },
    stop: (state) => {
      state.status = "stopped"
    },
    reset: (state) => {
      state.status = "idle"
      state.offset = 0
    },
    setOffset: (state, action) => {
      state.offset = action.payload
    },
    setSyncLocation: (state, action) => {
      state.sync = action.payload
    },
  },
})

export const { start, stop, reset, setOffset, setSyncLocation } =
  timerSlice.actions

export const selectStatus = (state: RootState) => state.timer.status
export const selectStart = (state: RootState) =>
  state.timer.startTS - state.timer.offset
export const selectOffset = (state: RootState) => state.timer.offset
export const selectSyncLocation = (state: RootState) => state.timer.sync
export default timerSlice.reducer
