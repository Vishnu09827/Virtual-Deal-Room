import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import DealList from "./features/deal/DealList";
import CreateDeal from "./features/deal/CreateDeal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* Protected  routes*/}
        <Route path="deal" >
          <Route index element={<DealList/>}/>
          <Route path="new" element={<CreateDeal/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
