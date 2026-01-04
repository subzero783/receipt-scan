"use client";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "100px auto",
};

const Spinner = () => {
  return (
    <ClipLoader
      color="#1e90ff"
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
      className="spinner"
    />
  );
};
export default Spinner;
