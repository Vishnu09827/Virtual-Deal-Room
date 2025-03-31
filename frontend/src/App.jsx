import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import DealList from "./features/deal/DealList";
import CreateDeal from "./features/deal/CreateDeal";
import Header from "./components/Header";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import EditDeal from "./features/deal/EditDeal";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Protected  routes*/}
          <Route element={<ProtectedRoute />}>
            <Route path="deals">
              <Route index element={<DealList />} />
              <Route path="new" element={<CreateDeal />} />
              <Route path=":did" element={<EditDeal />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
