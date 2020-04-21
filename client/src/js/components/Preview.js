import React, { useState, useEffect } from "react";

function Preview({ projectId, containerId, reload }) {
  return (
    <iframe
      key={reload}
      src={`/code/project/${projectId}/preview?reload=${reload}`}
      width="100%"
      height="400px"
      id={containerId}
    />
  );
}

export default Preview;
