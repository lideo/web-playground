import createEditor from "./playgroundEditor";

const onSave = function() {
  // eslint-disable-next-line no-console
  console.log("Saving...");

  document.getElementById("save-project").click();
};

const jsCodeContainer = document.getElementById("js_code");
const cssCodeContainer = document.getElementById("css_code");
const htmlCodeContainer = document.getElementById("html_code");

export default {
  js: createEditor(jsCodeContainer, onSave, {
    mode: "javascript"
  }),
  css: createEditor(cssCodeContainer, onSave, {
    mode: "css"
  }),
  html: createEditor(htmlCodeContainer, onSave, {
    mode: "html"
  })
};
