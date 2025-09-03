import { useState } from 'react'
import './App.css'
import Title from './components/Title'
import LeftNavBar from './components/LeftNavBar'


function App() {
  

  return (
    <>
      <Title />

      <div style={{position: 'absolute', left: 0 }}> 
      <LeftNavBar />
      </div>
    </>
  )
}

export default App
