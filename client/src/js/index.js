// Import styles
import "../scss/main.scss";

// Set up Stimulus
import { Application } from "stimulus";
import { definitionsFromContext } from "stimulus/webpack-helpers";

const application = Application.start();
const context = require.context("./controllers", true, /\.js$/);
application.load(definitionsFromContext(context));

const form = document.getElementById("project-form");
form.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(form);
  const values = {};
  for (var pair of formData.entries()) {
    values[pair[0]] = pair[1];
  }

  fetch(form.getAttribute("action"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(values)
  })
    .then(response => response.text())
    .then(response => {
      console.log("Success:", response);

      document
        .getElementById("project-preview")
        .contentWindow.location.reload();
    })
    .catch(error => {
      console.error("Error:", error);
    });
});
