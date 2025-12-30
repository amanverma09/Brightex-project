import React, { useEffect } from "react";
import api from "./api";

const Test = () => {
  useEffect(() => {
    api
      .get("/test")
      .then((res) => console.log("API Response:", res.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Testing Backend API...</h2>
    </div>
  );
};

export default Test;
