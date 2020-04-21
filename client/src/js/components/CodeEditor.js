import React from "react";

function CodeEditor({ type, onChangeInput = () => ({}), value }) {
  return (
    <textarea
      name={`${type}_code`}
      id={`${type}_code`}
      value={value}
      onChange={onChangeInput}
    />
  );
}

export default CodeEditor;
