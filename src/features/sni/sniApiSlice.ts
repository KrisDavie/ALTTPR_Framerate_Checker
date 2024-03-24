import type { RootState } from "@/app/store"
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport"
import { setConnectedDevice, setCurRead, setDeviceList, setGrpcConnected, setLastRead } from "./sniSlice"
import {
  DevicesClient,
  DeviceControlClient,
  DeviceMemoryClient,
} from "@/sni/sni.client"
import { AddressSpace, MemoryMapping } from "@/sni/sni"

const getTransport = (state: any) => {
  return new GrpcWebFetchTransport({
    baseUrl: `http://${state.sni.grpcHost}:${state.sni.grpcPort}`,
  })
}

const ingame_modes = [0x07, 0x09, 0x0b]

type SRAMLocs = {
  [key: number]: [string, number]
}

const sram_locs: SRAMLocs = {
  0xf50010: ["game_mode", 0x1],
  0xe02000: ["rom_name", 0x15],
  0xf5f000: ["base", 0x256],
  0xf5f280: ["overworld", 0x82],
  0xf5f340: ["inventory", 0x1bd],
  0xf5f3c6: ["misc", 0x4],
  0xf5f410: ["npcs", 0x2],
  0xf5f4d0: ["multiinfo", 0x4],
  0xf66018: ["pots", 0x250],
  0xf66268: ["sprites", 0x250],
  0xf664b8: ["shops", 0x29],
}

export const sniApiSlice = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: "sniApi",
  endpoints: builder => ({
    getDevices: builder.query({
      async queryFn(
        arg: { noConnect: boolean },
        queryApi,
        extraOptions,
        baseQuery,
      ) {
        const transport = getTransport(queryApi.getState() as RootState)
        try {
          let devClient = new DevicesClient(transport)
          let devicesReponse = await devClient.listDevices({ kinds: [] })
          let devices = devicesReponse.response.devices.map(
            device => device.uri,
          )
          queryApi.dispatch(setGrpcConnected(true))
          queryApi.dispatch(setDeviceList(devices))
          if (devices.length > 0 && !arg.noConnect) {
            queryApi.dispatch(setConnectedDevice(devices[0]))
          }
          return { data: devices }
        } catch (e) {
          return { error: "Error getting devices." }
        }
      },
    }),
    reset: builder.mutation({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const state = queryApi.getState() as RootState
        const transport = getTransport(state)
        let controlClient = new DeviceControlClient(transport)
        let connectedDevice = state.sni.connectedDevice
        if (connectedDevice) {
          const res = await controlClient.resetSystem({ uri: connectedDevice })
          return { data: res }
        } else {
          return { error: "No device selected" }
        }
      },
    }),
    readMemory: builder.query({
      async queryFn(
        arg: { memLoc: number; size: number },
        queryApi,
        extraOptions,
        baseQuery,
      ) {
        const state = queryApi.getState() as RootState
        const transport = getTransport(state)
        let controlMem = new DeviceMemoryClient(transport)
        let connectedDevice = state.sni.connectedDevice
        if (!connectedDevice) {
          return { error: "No device selected" }
        }
        let memResponse = await controlMem.singleRead({
          uri: connectedDevice,
          request: {
            requestMemoryMapping: MemoryMapping.LoROM,
            requestAddress: arg.memLoc,
            requestAddressSpace: AddressSpace.FxPakPro,
            size: arg.size,
          },
        })
        if (!memResponse.response.response) {
          return { error: "Error reading memory, no reposonse" }
        }
        console.log(memResponse.response.response.data)
        const frames = new Uint32Array(
          new Uint8Array([memResponse.response.response.data[0],
            memResponse.response.response.data[1],
            memResponse.response.response.data[2],
            memResponse.response.response.data[3]]).buffer
        )[0]
        if (state.sni.curRead && state.sni.curTimestamp) { 
          queryApi.dispatch(setLastRead([state.sni.curRead, state.sni.curTimestamp] ))
        }
        queryApi.dispatch(setCurRead([frames, Date.now()]))
        return {
          requestAddress: memResponse.response.response.requestAddress,
          data: frames, // Convert Uint8Array to Array to be able to serialize
        }
      },
    }),
  }),
})

export const {
  useGetDevicesQuery,
  useLazyGetDevicesQuery,
  useResetMutation,
  useReadMemoryQuery,
} = sniApiSlice
