import { useEffect, useState } from "react"
import { useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"

import { useReadMemoryQuery } from "../sni/sniApiSlice"
import { Input } from "@/components/ui/input"

export function Timer() {
  const [msToCount, setMsToCount] = useState(500)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [shouldReset, setShouldReset] = useState(false)
  const [avgFps, setAvgFps] = useState(0)
  const [allFrames, setAllFrames] = useState<number[]>([])

  useReadMemoryQuery(
    { memLoc: 0xf5f43e, size: 4 },
    { pollingInterval: msToCount },
  )
  const curFrames = useAppSelector((state) => state.sni.curRead)
  const curTimestamp = useAppSelector((state) => state.sni.curTimestamp)
  const lastFrames = useAppSelector((state) => state.sni.lastRead)
  const lastTimestamp = useAppSelector((state) => state.sni.lastTimestamp)
  const curDevice = useAppSelector((state) => state.sni.connectedDevice)

  useEffect(() => {
    const interval = setInterval(() => {}, msToCount + 1000)
    return () => {
      clearInterval(interval)
    }
  }, [msToCount])

  useEffect(() => {
    if (curFrames && lastFrames && curTimestamp && lastTimestamp) {
      let fps =
        ((curFrames - lastFrames) / (curTimestamp - lastTimestamp)) * 1000
      if (fps > 0) {
        allFrames.push(fps)
        setAvgFps(allFrames.reduce((a, b) => a + b) / allFrames.length)
      }
    }
  }, [curFrames])

  useEffect(() => {
    if (curDevice) {
      setAllFrames([])
      setShouldReset(false)
    }
  }, [curDevice, shouldReset])

  return (
    <div className="flex flex-col w-2/3 items-center">
      <Button className="mt-2" onClick={() => setIsCollapsed(!isCollapsed)}>
        How to use
      </Button>
      {isCollapsed ? null : (
        <div>
          1. Start SNI - (q)usb2snes will NOT work
          <br />
          2. If you have multiple devices, select the device you want to connect
          in the menu in the top right.
          <br />
          3. Set the polling rate in the box below (lower poll rates have more
          error).
          <br />
          4. Load an ALTTPR seed in a <b>non-completed</b> save and enter the
          game (link's house or sanc is fine)
          <br />
          5. Idle in the game - save and quits will stop the counter and give
          innacurate results
          <br />
          6. Click the "Reset Counters" button to start counting frames.
          <br />
          <br />
          The longer you run the counter, the more accurate the FPS will be.
        </div>
      )}
      <br />
      Connected to<span className="font-extrabold">{curDevice}</span>
      <br />
      Polling Rate (ms):
      <Input
        className="w-36"
        type="number"
        onChange={(e) => setMsToCount(parseInt(e.target.value))}
        value={msToCount}
      />
      <Button className="mt-2" onClick={() => setShouldReset(true)}>
        Reset Counters
      </Button>
      {curFrames && lastFrames && allFrames.length > 0 ? (
        <div className="mt-4 flex flex-col items-center">
          {
            <div className="flex flex-col items-center">
              FPS: {allFrames[allFrames.length - 1].toFixed(4)}
              {allFrames.length > 0 && (
                <div className="mt-4 flex flex-col items-center">
                  <div>
                    Stats over{" "}
                    <span
                      className={
                        allFrames.length * msToCount < 300 * 1000
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {allFrames.length} samples (
                      {((allFrames.length * msToCount) / 1000).toFixed(1)}{" "}
                      seconds)
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    Avg. FPS: {avgFps.toFixed(4)} (
                    {((avgFps / 60.0988) * 100).toFixed(3)}% of original
                    hardware)
                  </div>
                  <div className="flex flex-col items-center">
                    Standard Deviation:{" "}
                    {Math.sqrt(
                      allFrames
                        .map((x) => Math.pow(x - avgFps, 2))
                        .reduce((a, b) => a + b) / allFrames.length,
                    ).toFixed(4)}
                  </div>
                  <div className="flex flex-col items-center">
                    <br />
                    With this frame rate you{" "}
                    {avgFps > 60.0988 ? "gain" : "lose"} approximately{" "}
                    {Math.abs(((avgFps - 60.0988) / 60.0988) * 3600).toFixed(2)}{" "}
                    seconds per hour compared to original hardware
                  </div>
                </div>
              )}
              <br />
            </div>
          }
        </div>
      ) : (
        <>
        < br/>
          <span className="font-bold text-red-600">ERROR: No data - Are you in game, in a non-completed save?</span>
          </>)}
    </div>
  )
}

export default Timer
