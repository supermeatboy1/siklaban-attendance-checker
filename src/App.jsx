import { useState, useEffect, useRef } from 'react'
import intramuralsWordmark from './assets/Wordmark.png'

import Button from './components/Button.jsx';

function App() {
  //const [count, setCount] = useState(0)
  const [clockIn, setClockIn] = useState(true)
  const [useRFID, setUseRFID] = useState(true)
  const [idInput, setIdInput] = useState("")
  const [lastInputTime, setLastInputTime] = useState(Date.now())
  const idInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (useRFID && document.activeElement != idInputRef.current) {
        console.log("Bringing back the focus...")
        idInputRef.current?.focus();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [useRFID])

  return (
    <>
      <div className="bg-zinc-950 flex flex-col h-lvh">
        <div className="w-4/10 mx-auto">
          <img src={intramuralsWordmark} alt="Siklaban 2025 Wordmark" className="p-10" />
        </div>
        <div className="mx-auto">
          <div className="flex flex-row justify-center">
            <Button type="button" onClick={() => { setUseRFID(true); setIdInput("") }} selected={useRFID}>Use RFID</Button>
            <Button type="button" onClick={() => { setUseRFID(false); setIdInput("") }} selected={!useRFID}>Use Student ID</Button>
          </div>
          <div className="p-10">
            <label className="block text-sm font-medium text-gray-100">{useRFID ? "RFID Input" : "Student ID Input"}</label>
            <input
                ref={idInputRef}
                type='text'
                name='idInput'
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md"
                value={idInput}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setIdInput(value);
                }}
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    console.log("Current input: " + idInput);
                    setIdInput("");
                  } else if (useRFID) {
                    const diff = Date.now() - lastInputTime;
                    setLastInputTime(Date.now());
                    if (diff > 250) {
                      setIdInput("");
                    }
                  }
                }}
            />
          </div>
          <div className="flex flex-row justify-center">
            <Button type="button" onClick={() => { setClockIn(true) }} selected={clockIn}>IN</Button>
            <Button type="button" onClick={() => { setClockIn(false) }} selected={!clockIn}>OUT</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
