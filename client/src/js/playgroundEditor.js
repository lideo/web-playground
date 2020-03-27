import CodeMirror from "codemirror/lib/codemirror.js";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";

import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";

import "codemirror/theme/monokai.css";

import "codemirror/lib/codemirror.css";

const createEditor = function(container, onSave = function() {}, options) {
  const defaultOptions = Object.assign(
    {
      mode: "javascript",
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      theme: "monokai",
      gutter: true,
      lineWrapping: true
    },
    options
  );

  const editor = CodeMirror.fromTextArea(container, defaultOptions);

  editor.setSize("100%", "100%");
  container.addEventListener("click", () => editor.focus());
  editor.focus();

  const save = () => onSave(editor.getValue());
  editor.setOption("extraKeys", {
    "Ctrl-S": save,
    "Cmd-S": save
  });

  return editor;
};

export default createEditor;
