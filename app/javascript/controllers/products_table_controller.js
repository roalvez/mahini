import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["row", "loading"];

  showLoading() {
    if (this.hasLoadingTarget) {
      this.loadingTarget.classList.remove(
        "h-0",
        "opacity-0",
        "pointer-events-none"
      );
      this.loadingTarget.classList.add(
        "h-16",
        "opacity-100",
        "pointer-events-auto"
      );
      const inner = this.loadingTarget.querySelector("div");
      if (inner) {
        inner.style.height = "4rem";
      }
    }
    this.rowTargets.forEach((row) => {
      row.style.opacity = "0.3";
    });
  }

  hideLoading() {
    if (this.hasLoadingTarget) {
      this.loadingTarget.classList.remove(
        "h-16",
        "opacity-100",
        "pointer-events-auto"
      );
      this.loadingTarget.classList.add(
        "h-0",
        "opacity-0",
        "pointer-events-none"
      );
      const inner = this.loadingTarget.querySelector("div");
      if (inner) {
        inner.style.height = "0px";
      }
    }
    this.rowTargets.forEach((row) => {
      row.style.opacity = "1";
    });
  }

  connect() {
    this.beforeFetch = (e) => {
      if (e.target.id === "products_table") {
        this.showLoading();
      }
    };
    this.frameLoad = (e) => {
      if (e.target.id === "products_table") {
        this.hideLoading();
      }
    };
    document.addEventListener("turbo:before-fetch-request", this.beforeFetch);
    document.addEventListener("turbo:frame-load", this.frameLoad);
  }

  disconnect() {
    document.removeEventListener(
      "turbo:before-fetch-request",
      this.beforeFetch
    );
    document.removeEventListener("turbo:frame-load", this.frameLoad);
  }
}
