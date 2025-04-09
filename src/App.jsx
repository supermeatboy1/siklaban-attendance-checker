import { useState, useEffect, useRef } from 'react'
import intramuralsWordmark from './assets/Wordmark.png'

import Button from './components/Button.jsx';
import ConfirmationModal from "./components/ConfirmationModal";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

function App() {
  const [clockIn, setClockIn] = useState(true)
  const [useRFID, setUseRFID] = useState(true)
  const [idInput, setIdInput] = useState("")
  const [lastInputTime, setLastInputTime] = useState(Date.now())
  const [idConfirmModal, setIdConfirmModal] = useState(false);
  const idInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (useRFID && document.activeElement != idInputRef.current && !idConfirmModal) {
        console.log("Bringing back the focus...")
        idInputRef.current?.focus();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [useRFID, idConfirmModal, idInputRef])

  const fetchStudent = async (isRFID, currentInput) => {
    console.log(`isRFID: ${isRFID}, currentInput: ${currentInput}`)

    if (!isRFID) {
      const { data, error } = await supabase
        .from('StudentsWithCluster')
        .select("student_id, name, cluster_name")
        .eq("student_id", currentInput)
      console.log(data)
    }
    //setIdConfirmModal(true);
  }

  return (
    <>
      <div className="bg-zinc-950 flex flex-col h-lvh">
        <div className="m-auto">
          <div className="w-5/8 m-auto">
            <img src={intramuralsWordmark} alt="Siklaban 2025 Wordmark" className="p-10" />
          </div>
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
                    const currentIdInput = idInput;
                    fetchStudent(useRFID, currentIdInput);
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
        {idConfirmModal && (
            <ConfirmationModal
                noButton='No'
                yesButton='Yes'
                message='Are you this person? ' 
                onYes={() => setIdConfirmModal(false) }
                onNo={() => setIdConfirmModal(false)}
            />
        )}
    </>
  )
}

export default App
