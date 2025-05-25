import React from "react";
import Header from "../../components/Header";

const MyMembership = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">
          You haven't purchased any memberships yet.
        </h1>
      </div>
    </>
  );
};

export default MyMembership;
