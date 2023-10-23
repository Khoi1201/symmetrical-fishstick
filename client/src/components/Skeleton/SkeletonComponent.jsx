import { Skeleton } from "antd";
import React from "react";

const SkeletonComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
      }}
    >
      <Skeleton />
    </div>
  );
};

export default SkeletonComponent;
