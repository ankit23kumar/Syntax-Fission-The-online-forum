import React from "react";

const Unauthorized = () => {
  return (
    <div className="text-center p-5">
      <h1 className="text-danger">403 - Unauthorized</h1>
      <p>You do not have access to this page.</p>
    </div>
  );
};

export default Unauthorized;
