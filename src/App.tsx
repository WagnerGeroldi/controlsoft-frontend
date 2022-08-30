import React from "react";
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
import { UpdateUser } from "./pages/HandleUser/UpdateUser";

import { Products } from "./pages/Products/Products";
import { CreateProduct } from "./pages/Products/CreateProduct";
import { UpdateProduct } from "./pages/Products/UpdateProduct";

import { Category } from "./pages/Category/Category";
import { CreateCategory } from "./pages/Category/CreateCategory";
import { UpdateCategory } from "./pages/Category/UpdateCategory";

import { NewDecreaseOrder } from "./pages/DecreaseOrder/NewDecreaseOrder";
import { ReportPage } from "./pages/report/ReportPage";
import { ReportTotalStock } from "./pages/report/ReportTotalStock";
import { ReportStockCategory } from "./pages/report/ReportStockCategory";
import { UpdateStock } from "./pages/UpdateStock/UpdateStock";
import { ReportOutOfStock } from "./pages/report/ReportOutOfStock";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/infocreateaccount" element={<InfoCreatedAccount />} />

        <Route path="/dashboard/:id" element={<Dashboard />} />

        <Route path="/updatePassword" element={<UpdatePassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route path="/user/config/:id" element={<ConfigPage />} />
        <Route path="/user/updateUser/:id" element={<UpdateUser />} />

        <Route path="/products/:id" element={<Products />} />
        <Route path="/products/createProduct/:id" element={<CreateProduct />} />
        <Route path="/products/updateProduct/:id" element={<UpdateProduct />} />

        <Route path="/category/:id" element={<Category />} />
        <Route
          path="/category/createCategory/:id"
          element={<CreateCategory />}
        />
        <Route
          path="/category/updateCategory/:id"
          element={<UpdateCategory />}
        />

        <Route
          path="/order/newDecreaseOrder/:id"
          element={<NewDecreaseOrder />}
        />

        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/reportTotalStock/:id" element={<ReportTotalStock />} />
        <Route
          path="/reportStockCategory/:id"
          element={<ReportStockCategory />}
        />
        <Route
          path="/reportOutOfStock/"
          element={<ReportOutOfStock />}
        />

        <Route path="/products/updateStock/:id" element={<UpdateStock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
