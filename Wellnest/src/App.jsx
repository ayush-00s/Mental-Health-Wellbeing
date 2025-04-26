import { useState } from 'react'
import { Routes, Route, Link } from "react-router-dom"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Test from './pages/Test'
import Create from './components/Create'

function App() {
  

  return (
     <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="/SignIn" element={<SignIn/>} />
      <Route path="/Home" element={<Home/>} />
      <Route path="/Test" element={<Test/>} />
      
    </Routes>
  
  )
}

export default App
