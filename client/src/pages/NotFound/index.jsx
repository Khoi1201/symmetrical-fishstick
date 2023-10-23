import { Empty } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = ({ setMenu }) => {
  useEffect(() => {
    setMenu();
  });
  const navigate = useNavigate();
  return (
    <div>
      NotFound
      <Empty>
        <button onClick={() => navigate("/", { replace: true })}>
          Back to Home
        </button>
      </Empty>
    </div>
  );
};

export default NotFound;
