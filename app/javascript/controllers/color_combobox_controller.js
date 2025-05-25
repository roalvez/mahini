import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "dropdown", "options", "hiddenSelect", "clearButton", "arrow"];
  static values = { colors: Array };

  connect() {
    this.filteredColors = this.colorsValue || [];
    this.selectedColor = null;
    this.populateOptions();
    this.updateClearButton();

    // Handle clicks outside to close dropdown
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  disconnect() {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  onInput() {
    const query = this.inputTarget.value.toLowerCase().trim();

    // Update clear button visibility
    this.updateClearButton();

    // Filter colors based on query
    if (query === '') {
      this.filteredColors = this.colorsValue || [];
      this.selectedColor = null;
    } else {
      this.filteredColors = this.colorsValue.filter(color =>
        color.name.toLowerCase().includes(query)
      );

      // Check if query matches any existing color exactly
      const exactMatch = this.colorsValue.find(color =>
        color.name.toLowerCase() === query.toLowerCase()
      );

      if (exactMatch) {
        this.selectColor(exactMatch);
      } else {
        this.selectedColor = null;
      }
    }

    this.populateOptions();
    this.showDropdown();
  }

  onFocus() {
    this.filteredColors = this.colorsValue || [];
    this.populateOptions();
    this.showDropdown();
  }

  toggleDropdown() {
    if (this.dropdownTarget.classList.contains('hidden')) {
      this.showDropdown();
    } else {
      this.hideDropdown();
    }
  }

  showDropdown() {
    this.dropdownTarget.classList.remove('hidden');

    // Rotate arrow
    if (this.hasArrowTarget) {
      this.arrowTarget.classList.add('rotate-180');
    }
  }

  hideDropdown() {
    this.dropdownTarget.classList.add('hidden');

    // Reset arrow rotation
    if (this.hasArrowTarget) {
      this.arrowTarget.classList.remove('rotate-180');
    }
  }

  populateOptions() {
    let html = '';

    if (this.filteredColors.length > 0) {
      this.filteredColors.forEach(color => {
        const isSelected = this.selectedColor && this.selectedColor.id === color.id;
        html += `
          <div class="flex items-center px-3 py-2 hover:bg-pink-50 cursor-pointer ${isSelected ? 'bg-pink-100' : ''}"
               data-action="click->color-combobox#selectColorFromDropdown"
               data-color-id="${color.id}"
               data-color-name="${color.name}"
               data-color-hex="${color.hex}">
            <div class="w-4 h-4 rounded border border-gray-300 mr-3"
                 style="background-color: ${color.hex}"></div>
            <span class="text-sm">${color.name}</span>
            <span class="text-xs text-gray-500 ml-auto">${color.hex}</span>
          </div>
        `;
      });
    } else if (this.inputTarget.value.trim()) {
      html = `
        <div class="px-3 py-2 text-sm text-gray-500 text-center">
          Nenhuma cor encontrada
        </div>
      `;
    } else {
      html = `
        <div class="px-3 py-2 text-sm text-gray-500 text-center">
          Digite para buscar cores existentes
        </div>
      `;
    }

    this.optionsTarget.innerHTML = html;

    // Update hidden select options
    this.updateHiddenSelect();
  }

  updateHiddenSelect() {
    if (!this.hasHiddenSelectTarget) return;

    this.hiddenSelectTarget.innerHTML = '<option value="">Selecione uma cor...</option>';

    this.colorsValue.forEach(color => {
      const option = document.createElement('option');
      option.value = color.id;
      option.textContent = color.name;
      if (this.selectedColor && this.selectedColor.id === color.id) {
        option.selected = true;
      }
      this.hiddenSelectTarget.appendChild(option);
    });
  }

  selectColorFromDropdown(event) {
    const colorId = event.currentTarget.dataset.colorId;
    const colorName = event.currentTarget.dataset.colorName;
    const colorHex = event.currentTarget.dataset.colorHex;

    const color = { id: colorId, name: colorName, hex: colorHex };
    this.selectColor(color);
    this.hideDropdown();
  }

  selectColor(color) {
    this.selectedColor = color;
    this.inputTarget.value = color.name;

    // Update hidden select
    this.updateHiddenSelect();

    // Update clear button visibility
    this.updateClearButton();

    // Trigger color selection event for product variants controller
    this.triggerColorSelection(color);
  }

  triggerColorSelection(color) {
    // Find the variant div and trigger the color selection
    const variantDiv = this.element.closest('[data-variant-index]');
    if (variantDiv) {
      const variantIndex = variantDiv.dataset.variantIndex;

      // Dispatch custom event that the product variants controller can listen to
      const event = new CustomEvent('colorSelected', {
        detail: { variantIndex, color },
        bubbles: true
      });
      this.element.dispatchEvent(event);
    }
  }

  clearFilter() {
    this.inputTarget.value = '';
    this.selectedColor = null;
    this.filteredColors = this.colorsValue || [];
    this.updateClearButton();
    this.updateHiddenSelect();
    this.populateOptions();
    this.inputTarget.focus();

    // Trigger clear event
    const variantDiv = this.element.closest('[data-variant-index]');
    if (variantDiv) {
      const variantIndex = variantDiv.dataset.variantIndex;
      const event = new CustomEvent('colorCleared', {
        detail: { variantIndex },
        bubbles: true
      });
      this.element.dispatchEvent(event);
    }
  }

  updateClearButton() {
    if (this.hasClearButtonTarget) {
      const hasValue = this.inputTarget.value.trim() !== '';
      if (hasValue) {
        this.clearButtonTarget.classList.remove('hidden');
      } else {
        this.clearButtonTarget.classList.add('hidden');
      }
    }
  }

  handleDocumentClick(event) {
    if (!this.element.contains(event.target)) {
      this.hideDropdown();
    }
  }
}
