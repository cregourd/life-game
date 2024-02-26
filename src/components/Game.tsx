import clsx from "clsx"
import { useCallback, useEffect, useMemo, useState } from "react"
import useMatrix, { ACTIONS } from "../utils/useMatrix"
import { Clear, Pause, Play, Random, Setting } from "./Icons"
import SettingModal from "./SettingModal"
import Toolbar, { ToolBarItems } from "./Toolbar"

const Game = () => {

  const x = useMemo(() => Math.floor(window.innerWidth / 10), [])
  const y = useMemo(() => Math.floor(window.innerHeight / 10), [])
  const [matrix, dispatch] = useMatrix(x, y)
  const [running, setRunning] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key === ' ') {
        setRunning(!running);
      }
    },
    [running]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const updateMatrix = useCallback(() => dispatch({ type: ACTIONS.UPDATE_MATRIX }), [dispatch])

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    if (running) {
      updateMatrix()
      intervalId = setInterval(updateMatrix, 100);
    }
    return () => {
      clearInterval(intervalId)
    }
  }, [running, updateMatrix])

  const handleClick = useCallback((x: number, y: number) => {
    if (!running) {
      dispatch({ type: ACTIONS.TOGGLE_CELL, payload: { x, y } })
    }
  }, [running, dispatch])

  const handleRandomize = useCallback(() => {
    if (!running) {
      dispatch({ type: ACTIONS.RANDOMIZE_MATRIX })
    }
  }, [running, dispatch])

  const handleClear = useCallback(() => {
    if (!running) {
      dispatch({ type: ACTIONS.CLEAR_MATRIX })
    }
  }, [running, dispatch])

  const handleSettings = useCallback(() => {
    setIsOpenModal(true)
    setRunning(false)
  }, [])

  const toolbar: ToolBarItems = [{
    icon: running ? <Pause /> : <Play />,
    onClick: () => setRunning(!running),
    title: running ? 'Pause' : 'Play'
  }, {
    icon: <Random />,
    onClick: handleRandomize,
    title: 'Randomize'
  }, {
    icon: <Clear />,
    onClick: handleClear,
    title: 'Clear'
  }, {
    icon: <Setting />,
    onClick: handleSettings,
    title: 'Settings',
  }]

  return (
    <div
      className={clsx('relative w-full', !running && 'cursor-pointer')}>
      <div style={{
        gridTemplateColumns: `repeat(${x}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${y}, minmax(0, 1fr))`
      }} className={`grid`}>
        {matrix.map((row, rowIndex) => {
          return row.map((value, colIndex) => (
            <div
              onClick={() => handleClick(rowIndex, colIndex)}
              className={
                clsx('w-[10px] h-[10px] border-[.1px]'
                  , value ? 'bg-black border-black' : 'border-gray-300')}
              key={`${rowIndex}-${colIndex}`}
            />
          ))
        })}
      </div>
      <Toolbar items={toolbar} />
      <SettingModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
    </div>
  );
}

export default Game