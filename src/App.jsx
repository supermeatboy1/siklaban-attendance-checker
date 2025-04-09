import { useState, useEffect, useRef } from 'react'
import intramuralsWordmark from './assets/Wordmark.png'

import Button from './components/Button.jsx';
import ConfirmationModal from "./components/ConfirmationModal";
import ErrorDialogModal from "./components/ErrorDialogModal";
import LoadingModal from "./components/LoadingModal";
import DialogModal from "./components/DialogModal";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY)

function App() {
  const CLUSTERS = ["ATYCB - Ardor", "CHS - Fuego", "CAS - Incendio", "CEA - Lumbre", "CCIS - Stella"]

  const [clockIn, setClockIn] = useState(true)
  const [useRFID, setUseRFID] = useState(true)
  const [idInput, setIdInput] = useState("")
  const [lastInputTime, setLastInputTime] = useState(Date.now())
  const [errorLog, setErrorLog] = useState(null);
  const [idConfirm, setIdConfirm] = useState(null);
  const [idConfirmModal, setIdConfirmModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [foundStudent, setFoundStudent] = useState("[ERROR]");
  const idInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (useRFID && document.activeElement != idInputRef.current && idConfirm != null) {
        console.log("Bringing back the focus...")
        idInputRef.current?.focus();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [useRFID, idConfirm, idInputRef])

  const fetchStudent = async (isRFID, currentInput) => {
    console.log(`isRFID: ${isRFID}, currentInput: ${currentInput}`)

    if (!isRFID) {
      const { data, error } = await supabase
        .from('StudentsWithCluster')
        .select("student_id, name, cluster_name")
        .eq("student_id", currentInput)

      if (error) {
        setErrorLog(error);
        return;
      }
      if (data.length == 0) {
        setErrorLog(`Student with ID "${currentInput}" not found.`);
        return;
      } else {
        setIdConfirm(data[0]);
        setIdConfirmModal(true);

        console.log(data[0]);
      }
    } else {
      const { data, error } = await supabase
        .from('RfidToStudent')
        .select("student_id, rfid")
        .eq("rfid", currentInput)

      if (error) {
        setErrorLog(error);
        return;
      }
      if (data.length == 0) {
        setErrorLog(`RFID "${currentInput}" not found.`);
      } else {
        fetchStudent(false, data[0]["student_id"]);
      }
    }
  }

  const recordAttendance = async (studentId) => {
    const attendanceType = clockIn ? "IN" : "OUT";
    console.log(`Recording ${attendanceType} attendance for ${studentId}`);

    setIdConfirm(null);
    setIdConfirmModal(false);

    setLoadingModal(true);

    const { error } = await supabase
      .from('Attendance')
      .insert({ student_id: studentId, attendance_type: attendanceType });

    setLoadingModal(false);

    if (error) {
      setErrorLog(error);
    } else {
      setSuccessModal(true);
    }
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
        {(idConfirm != null && idConfirmModal) && (
            <ConfirmationModal
                noButton='No'
                yesButton='Yes'
                message={'Are you ' + idConfirm["name"] + " from the cluster " + idConfirm["cluster_name"] + "?"}
                onYes={() => {setIdConfirmModal(false); recordAttendance(idConfirm["student_id"]) } }
                onNo={() => {setIdConfirmModal(false); setIdConfirm(null);} }
            />
        )}
        {errorLog != null && (
            <ErrorDialogModal
                buttonText='Ok'
                message='An error occured. Please check the error message below.' 
                errorLog={errorLog}
                onClick={() => setErrorLog(null) }
            />
        )}
        {successModal && (
            <DialogModal
                buttonText='Ok'
                message='Attendance recorded.' 
                onClick={() => setSuccessModal(false) }
            />
        )}
        {loadingModal && (
            <LoadingModal
                message="Recording attendance..."
            />
        )}
    </>
  )
}

export default App
