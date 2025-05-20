import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { useState } from "react";

const MyReservations = () => {
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
