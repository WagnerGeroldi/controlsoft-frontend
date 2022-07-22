import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { Dashboard } from "./pages/Dashboard";
import { Initial } from "./pages/Initial";
import { Login } from "./pages/Login";
import { Register } from "./pages/HandleUser/Register";
import { ConfigPage } from "./pages/ConfigPage";
import { ResetPassword } from "./pages/HandleUser/ResetPassword";
import { UpdatePassword } from "./pages/HandleUser/UpdatePassword";
import { InfoCreatedAccount } from "./pages/HandleUser/InfoCreatedAccount";
import { Clients } from "./pages/Clients/Clients";
import { CreateClient } from "./pages/Clients/CreateClient";
import { UpdateClient } from "./pages/Clients/UpdateClient";

import { Products } from "./pages/Products/Products";
import { CreateProduct } from "./pages/Products/CreateProduct";
import { UpdateUser } from "./pages/HandleUser/UpdateUser";
import { NewSale } from "./pages/Sale/NewSale";
import { UpdateProduct } from "./pages/Products/UpdateProduct";
import { SaleDetails } from "./pages/Sale/SaleDetails";



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
        <Route path="/user/config/:id" element={<ConfigPage />} />
        <Route path="/user/updateUser/:id" element={<UpdateUser />} />

        <Route path="/clients/:id" element={<Clients />} />
        <Route path="/clients/createClient/:id" element={<CreateClient />} />
        <Route path="/clients/updateClient/:id" element={<UpdateClient />} />

        <Route path="/products/:id" element={<Products />} />
        <Route path="/products/createProduct/:id" element={<CreateProduct />} />
        <Route path="/products/updateProduct/:id" element={<UpdateProduct />} />


        <Route path="/sale/newSale/:id" element={<NewSale />} />
        <Route path="/sale/saleDetail/:id" element={<SaleDetails />} /> 
        NewSale
      </Routes>
    </BrowserRouter>
  );
}

export default App;
