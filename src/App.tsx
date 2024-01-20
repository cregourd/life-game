import clsx from "clsx"
import _ from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Pause, Play } from "./components/Icons"

const App = () => {

  const x = useMemo(() => Math.floor(window.innerWidth / 10), [])
  const y = useMemo(() => Math.floor(window.innerHeight / 10), [])
  const [matrix, setMatrix] = useState(Array.from({ length: y }, () => new Array(x).fill(0)))
  const [running, setRunning] = useState(false)

  const handleClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!running) {
        const newGrid = _.cloneDeep(matrix);
        newGrid[rowIndex][colIndex] = matrix[rowIndex][colIndex] ? 0 : 1;
        setMatrix(newGrid);
      }
    },
    [matrix, running]
  );

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

  const getNeighbors = useCallback((rowIndex: number, colIndex: number) => {
    let neighbors = 0
    for (let row = rowIndex - 1; row <= rowIndex + 1; row++) {
      for (let col = colIndex - 1; col <= colIndex + 1; col++) {
        if (row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length) {
          if (row !== rowIndex || col !== colIndex) {
            neighbors += matrix[row][col]
          }
        }
      }
    }
    return neighbors
  }, [matrix])

  const updateMatrix = useCallback(() => {
    console.timeEnd('updateMatrix')
    console.time('updateMatrix')
    setMatrix(matrix => {
      const newMatrix = _.cloneDeep(matrix)
      for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        for (let colIndex = 0; colIndex < matrix[rowIndex].length; colIndex++) {
          const cell = matrix[rowIndex][colIndex]
          const neighbors = getNeighbors(rowIndex, colIndex)
          if (cell === 0 && neighbors === 3) {
            newMatrix[rowIndex][colIndex] = 1
          } else if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
            newMatrix[rowIndex][colIndex] = 0
          }
        }
      }
      return newMatrix
    })
  }, [getNeighbors])

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (running) {
      intervalId = setInterval(updateMatrix, 100);
    }
    return () => {
      clearInterval(intervalId)
    }
  }, [running, matrix, updateMatrix])

  return (
    <div
      className={clsx('relative w-max', !running && 'cursor-pointer')}>
      <div style={{
        gridTemplateColumns: `repeat(${x}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${y}, minmax(0, 1fr))`
      }} className={`grid`}>
        {matrix.map((row, rowIndex) => {
          return row.map((value, colIndex) => {
            return <div
              onClick={() => { handleClick(rowIndex, colIndex) }}
              className={
                clsx('w-[10px] h-[10px] border-[.1px]'
                  , value ? 'bg-black border-black' : 'border-gray-300')}
              key={`${rowIndex}-${colIndex}`}
            />
          })
        })}
      </div>
      <div className="absolute top-0 right-0 m-2">
        <button onClick={() => { setRunning(!running) }}>
          {running ? <Pause /> : <Play />}
        </button>
      </div>
    </div>
  );
}

export default App;
