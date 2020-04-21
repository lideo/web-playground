import React from "react";

function SubmitButton({ id, type, className, label }) {
  return (
    <button className={className} id={id} type={type}>
      {label}
    </button>
  );
}

export default SubmitButton;
