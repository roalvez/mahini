import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["header"];
  static values = {
    currentSort: String,
    currentDirection: String
  };

  connect() {
    this.updateHeaderStates();
  }

  sort(event) {
    const header = event.currentTarget;
    const sortBy = header.dataset.sortBy;

    let direction = 'asc';

    // If clicking the same header, toggle direction
    if (this.currentSortValue === sortBy) {
      direction = this.currentDirectionValue === 'asc' ? 'desc' : 'asc';
    }

    this.currentSortValue = sortBy;
    this.currentDirectionValue = direction;

    this.updateHeaderStates();
    this.triggerSort(sortBy, direction);
  }

  updateHeaderStates() {
    this.headerTargets.forEach(header => {
      const sortBy = header.dataset.sortBy;
      const arrow = header.querySelector('[data-sortable-target="arrow"]');

      if (sortBy === this.currentSortValue) {
        header.classList.add('bg-pink-200');
        header.classList.remove('hover:bg-pink-150');

        if (arrow) {
          arrow.classList.remove('opacity-30', 'rotate-180');
          arrow.classList.add('opacity-100');

          if (this.currentDirectionValue === 'desc') {
            arrow.classList.add('rotate-180');
          }
        }
      } else {
        header.classList.remove('bg-pink-200');
        header.classList.add('hover:bg-pink-150');

        if (arrow) {
          arrow.classList.add('opacity-30');
          arrow.classList.remove('opacity-100', 'rotate-180');
        }
      }
    });
  }

  triggerSort(sortBy, direction) {
    // Get current URL parameters
    const url = new URL(window.location);
    url.searchParams.set('sort_by', sortBy);
    url.searchParams.set('sort_direction', direction);
    url.searchParams.delete('page'); // Reset to first page when sorting

    // Use Turbo to navigate
    Turbo.visit(url.toString(), { frame: "products_table" });
  }
}
