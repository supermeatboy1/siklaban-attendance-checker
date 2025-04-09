import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index"
import ManualAttendance from "./pages/ManualAttendance"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="manual_attendance" element={<ManualAttendance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
