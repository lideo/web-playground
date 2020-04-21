import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import CodeEditor from "./CodeEditor";
import SubmitButton from "./SubmitButton";
import Preview from "./Preview";

const GET_PROJECT_DATA = gql`
  query Project($projectId: ID!) {
    project(id: $projectId) {
      id
      name
      html_code
      css_code
      js_code
    }
  }
`;

const UPDATE_PROJECT_DATA = gql`
  mutation updateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      name
      html_code
      css_code
      js_code
    }
  }
`;

function Project({ projectId }) {
  // Fetch project data from graphql API with the useQuery hook from apollo-hooks
  const { loading, error, data } = useQuery(GET_PROJECT_DATA, {
    variables: {
      projectId
    }
  });

  // Update project data with graphql API with the useMutation hook from apollo-hooks
  const [updateProject, { updateData }] = useMutation(UPDATE_PROJECT_DATA);

  const formRef = useRef(null);

  const [timestamp, setTimestamp] = useState(Date.now());

  // Create state variables with useState hooks. Initial value "" (empty).
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [name, setName] = useState("");

  // Initialize state with project data from graphql API
  useEffect(
    () => {
      if (loading === false && data) {
        setHtmlCode(data.project.html_code);
        setCssCode(data.project.css_code);
        setJsCode(data.project.js_code);
        setName(data.project.name);
      }
    },
    // Only re-run the effect if 'loading' or 'data' change
    [loading, data]
  );

  // Event handlers
  const handleHtmlChange = event => setHtmlCode(event.target.value);
  const handleCssChange = event => setCssCode(event.target.value);
  const handleJsChange = event => setJsCode(event.target.value);
  const handleSubmit = event => {
    event.preventDefault();

    setHtmlCode(formRef.current.elements.html_code.value);
    setCssCode(formRef.current.elements.css_code.value);
    setJsCode(formRef.current.elements.js_code.value);

    // Do the graphql mutation
    updateProject({
      variables: {
        input: {
          id: projectId,
          name: name,
          html_code: htmlCode,
          css_code: cssCode,
          js_code: jsCode
        }
      }
    });

    setTimestamp(Date.now());
  };

  // Check if project data is still loading or if there is an error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  // Render the component
  return (
    <div>
      <form id="project-form" onSubmit={handleSubmit} ref={formRef}>
        <CodeEditor
          type="html"
          onChangeInput={handleHtmlChange}
          value={htmlCode}
        />
        <CodeEditor
          type="css"
          onChangeInput={handleCssChange}
          value={cssCode}
        />
        <CodeEditor type="js" onChangeInput={handleJsChange} value={jsCode} />
        <SubmitButton
          id="save-project"
          type="submit"
          className="button is-primary is-small"
          label="Save"
        />
      </form>
      <Preview
        projectId={projectId}
        containerId="project-preview"
        reload={timestamp}
      />
    </div>
  );
}

export default Project;
