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

  // Handle filter events from comboboxes
  filter(event) {
    const { name, value } = event.detail;

    // Get current form data
    const form = this.element.querySelector('form');
    const formData = new FormData(form);

    // Update the specific filter
    if (value && value.trim() !== '') {
      formData.set(name, value);
    } else {
      formData.delete(name);
    }

    // Apply all filters
    const filters = Object.fromEntries(formData.entries());
    this.applyFilters(filters);
  }

  // Handle form submission for text input filters
  filterForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData.entries());
    this.applyFilters(filters);
  }

  applyFilters(newFilters = {}) {
    // Get current URL parameters
    const url = new URL(window.location);

    // Update with new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    // Reset to first page when filtering
    url.searchParams.delete('page');

    // Use Turbo to navigate
    Turbo.visit(url.toString(), { frame: "products_table" });
  }

  clearFilters() {
    const url = new URL(window.location);

    // Remove filter parameters
    ['name', 'category', 'subcategory', 'available'].forEach(param => {
      url.searchParams.delete(param);
    });

    // Reset to first page
    url.searchParams.delete('page');

    // Use Turbo to navigate
    Turbo.visit(url.toString(), { frame: "products_table" });
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
