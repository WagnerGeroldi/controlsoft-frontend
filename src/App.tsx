import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { Initial } from "./pages/Initial";
import { Login } from "./pages/Login";
import { Register } from "./pages/HandleUser/Register";
import { UpdateUser } from "./pages/ConfigPage";
import { ResetPassword } from "./pages/HandleUser/ResetPassword";
import { UpdatePassword } from "./pages/HandleUser/UpdatePassword";
import { InfoCreatedAccount } from "./pages/HandleUser/InfoCreatedAccount";


import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/infocreateaccount" element={<InfoCreatedAccount />} />
        <Route path="/updatePassword" element={<UpdatePassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/user/update/:id" element={<UpdateUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
