import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["tab", "tabContent"];

  initialize() {
    this.showTab("html");
  }

  html() {
    this.showTab("html");
  }

  css() {
    this.showTab("css");
  }

  js() {
    this.showTab("js");
  }

  showTab(tab) {
    this.tab = tab;

    this.tabTargets.forEach(el => {
      el.parentNode.classList.toggle(
        "is-active",
        el.getAttribute("data-tab-index") === this.tab
      );
    });

    this.tabContentTargets.forEach(el => {
      el.classList.toggle(
        "is-active",
        el.getAttribute("data-tab-index") === this.tab
      );
    });
  }
}
