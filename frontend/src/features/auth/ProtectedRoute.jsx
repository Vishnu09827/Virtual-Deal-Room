import { Navigate ,Outlet } from "react-router-dom";
import Header from "../../components/Header";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
    console.log(children)
  return token ? (
    <>
      <Header />
      <Outlet /> 
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
