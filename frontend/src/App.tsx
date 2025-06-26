import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Register from "./pages/user/SignUp";
import Login from "./pages/user/Login";
import Dashboard from "./pages/user/Dashboard";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import Welcome from "./pages/Welcome";


function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>}/>

        <Route path="/signup" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
 <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
            <ToastContainer />

    </Router>
    
  )
}

export default App;