import { useState } from 'react'
import intramuralsLogo from './assets/Logo.png'
import intramuralsWordmark from './assets/Wordmark.png'

import Button from './components/Button.jsx';

function App() {
  //const [count, setCount] = useState(0)
  const [clockIn, setClockIn] = useState(true)

  return (
    <>
      <div className="bg-zinc-950 flex flex-col h-screen">
        <div className="w-4/10 mx-auto">
          <img src={intramuralsWordmark} alt="Siklaban 2025 Wordmark" className="p-10" />
        </div>
        <div className="mx-auto">
          <Button type="button">IN</Button>
        </div>
      </div>
    </>
  )
}

export default App
