import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import timerSlice from "../features/timer/timerSlice"
import { sniApiSlice } from "@/features/sni/sniApiSlice"
import sniSlice from "@/features/sni/sniSlice"

export const store = configureStore({
  reducer: {
    timer: timerSlice,
    sni: sniSlice,
    [sniApiSlice.reducerPath]: sniApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      sniApiSlice.middleware,
    ),
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
