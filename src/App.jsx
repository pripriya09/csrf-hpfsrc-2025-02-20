import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import RoutesPage from './Routes/Routes'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
   
     <RoutesPage/>
    </BrowserRouter>
  )
}

export default App
