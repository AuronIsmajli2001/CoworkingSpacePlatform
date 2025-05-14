import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

const MyReservations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
    }
  }, [navigate]);
  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold">Welcome to Contact Page</h1>
      </div>
    </>
  );
};

export default MyReservations;
