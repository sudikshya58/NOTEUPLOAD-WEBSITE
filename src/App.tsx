
import { Route, Routes } from "react-router-dom";
import { Header } from "./Component/Header";
import { Login } from "./Page/Login";
import { Password } from "./Component/Password";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Header/>}/>
        <Route path="/adminlogin" element={<Login/>}/>
        <Route path="/passwordlogin" element={<Password/>}/>

      </Routes>
    </>
  )
}

export default App
