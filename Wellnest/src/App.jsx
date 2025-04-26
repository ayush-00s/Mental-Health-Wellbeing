import { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Test from './pages/Test'
import Create from './components/Create'
import { useAuth } from './context/AuthProvider'

function App() {
  const { authUser, setAuthUser } = useAuth();

  // Initialize authUser from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !authUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, [authUser, setAuthUser]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Home" element={authUser ? <Home /> : <Navigate to="/SignIn" />} />
      <Route path="/Test" element={<Test />} />
      <Route path="/Create" element={<Create />} />
    </Routes>
  )
}

export default App