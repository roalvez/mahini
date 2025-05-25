import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "dropdown", "option", "arrow", "hiddenInput", "clearButton"];
  static values = {
    options: Array,
    placeholder: String,
    name: String,
    allowClear: { type: Boolean, default: true },
    subcategories: Array // For subcategory filtering
  };  connect() {
    console.log('Combobox controller connected with nameValue:', this.nameValue);
    this.filteredOptions = [...this.optionsValue];
    this.selectedValue = this.inputTarget.value;
    this.setupEventListeners();
    this.updateDisplay();
    this.setupAvailabilityOptions();
    this.setupClearButton();

    // Initialize filtered options based on component type
    this.initializeFilteredOptions();

    // Listen for category changes if this is a subcategory combobox
    if (this.nameValue === 'subcategory') {
      console.log('Setting up category:changed event listener for subcategory combobox');
      console.log('Subcategories value:', this.subcategoriesValue);
      document.addEventListener('category:changed', this.handleCategoryChange.bind(this));
    }
  }

  disconnect() {
    document.removeEventListener("click", this.handleDocumentClick.bind(this));
    if (this.nameValue === 'subcategory') {
      document.removeEventListener('category:changed', this.handleCategoryChange.bind(this));
    }
  }

  setupAvailabilityOptions() {
    // Handle special case for availability filter
    if (this.nameValue === 'available') {
      this.availabilityMap = {
        'Disponível': 'true',
        'Indisponível': 'false'
      };
      this.reverseAvailabilityMap = {
        'true': 'Disponível',
        'false': 'Indisponível'
      };
    }
  }

  setupClearButton() {
    if (this.allowClearValue && this.hasClearButtonTarget) {
      this.updateClearButtonVisibility();
    }
  }

  initializeFilteredOptions() {
    // Initialize filtered options based on component type
    if (this.nameValue === 'subcategory' && this.hasSubcategoriesValue) {
      const currentCategory = this.getCurrentCategoryValue();
      this.filterSubcategoriesByCategory(currentCategory);
    } else {
      this.filteredOptions = [...this.optionsValue];
    }
    this.updateFilteredOptions();
  }

  setupEventListeners() {
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  handleDocumentClick(event) {
    if (!this.element.contains(event.target)) {
      this.closeDropdown();
    }
  }

  handleCategoryChange(event) {
    console.log('handleCategoryChange called with event:', event);
    const selectedCategory = event.detail.category;
    console.log('Selected category from event:', selectedCategory);
    this.filterSubcategoriesByCategory(selectedCategory);
  }

  filterSubcategoriesByCategory(categoryName) {
    console.log('filterSubcategoriesByCategory called with:', categoryName);
    console.log('subcategoriesValue:', this.subcategoriesValue);

    if (!this.hasSubcategoriesValue) {
      console.log('No subcategoriesValue available');
      return;
    }

    if (!categoryName) {
      // Show all subcategories if no category selected
      this.filteredOptions = this.subcategoriesValue.map(sc => sc.name).sort();
    } else {
      // Filter subcategories by selected category
      this.filteredOptions = this.subcategoriesValue
        .filter(sc => {
          console.log('Checking subcategory:', sc.name, 'with category:', sc.category?.name);
          return sc.category && sc.category.name === categoryName;
        })
        .map(sc => sc.name)
        .sort();
    }

    console.log('Filtered options:', this.filteredOptions);

    // Clear current subcategory selection if it's not in the filtered options
    if (this.inputTarget.value && !this.filteredOptions.includes(this.inputTarget.value)) {
      this.clearFilter();
    }

    this.updateFilteredOptions();
  }

  toggleDropdown() {
    if (this.dropdownTarget.classList.contains("hidden")) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }  openDropdown() {
    // Reset filtered options to base options when opening
    this.filteredOptions = this.getBaseOptions();

    this.updateFilteredOptions();
    this.dropdownTarget.classList.remove("hidden");
    this.arrowTarget.classList.add("rotate-180");
    this.inputTarget.focus();
  }

  closeDropdown() {
    this.dropdownTarget.classList.add("hidden");
    this.arrowTarget.classList.remove("rotate-180");
  }

  onInput() {
    const query = this.inputTarget.value.toLowerCase().trim();

    // Get base options and filter them by the query
    const baseOptions = this.getBaseOptions();
    this.filteredOptions = baseOptions.filter(option =>
      option.toLowerCase().includes(query)
    );

    // If no matches found and user has typed something, add "Create new" option
    if (this.filteredOptions.length === 0 && query.length > 0 &&
        (this.nameValue === 'category' || this.nameValue === 'subcategory')) {
      this.filteredOptions = [`Criar nova: "${this.inputTarget.value}"`];
    }

    this.updateFilteredOptions();

    // Auto-open dropdown when typing
    if (!this.dropdownTarget.classList.contains("hidden") === false) {
      this.dropdownTarget.classList.remove("hidden");
      this.arrowTarget.classList.add("rotate-180");
    }

    this.updateClearButtonVisibility();
  }

  getBaseOptions() {
    // For subcategory, use filtered options if available, otherwise use all options
    if (this.nameValue === 'subcategory' && this.hasSubcategoriesValue) {
      const currentCategory = this.getCurrentCategoryValue();
      if (currentCategory) {
        return this.subcategoriesValue
          .filter(sc => sc.category && sc.category.name === currentCategory)
          .map(sc => sc.name)
          .sort();
      }
      return this.subcategoriesValue.map(sc => sc.name).sort();
    }

    return this.optionsValue;
  }

  getCurrentCategoryValue() {
    // Get the current category value from the category input
    const categoryInput = document.querySelector('[data-combobox-name-value="category"] [data-combobox-target="input"]');
    return categoryInput ? categoryInput.value : null;
  }

  selectOption(event) {
    const option = event.currentTarget;
    let displayValue = option.dataset.value;
    let actualValue = displayValue;

    // Handle "Create new" option
    if (displayValue.startsWith('Criar nova: "') && displayValue.endsWith('"')) {
      // Extract the new name from the "Create new" option
      displayValue = displayValue.replace('Criar nova: "', '').replace('"', '');
      actualValue = displayValue;
    }

    // Handle availability mapping
    if (this.nameValue === 'available' && this.availabilityMap[displayValue]) {
      actualValue = this.availabilityMap[displayValue];
    }

    this.inputTarget.value = displayValue;
    this.selectedValue = actualValue;

    // Update hidden input if it exists
    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = actualValue;
    }

    this.closeDropdown();
    this.updateClearButtonVisibility();

    // Notify if this is a category change
    if (this.nameValue === 'category') {
      console.log('Dispatching category:changed event with:', displayValue);
      document.dispatchEvent(new CustomEvent('category:changed', {
        detail: { category: displayValue }
      }));
    }

    this.triggerFilter();
  }

  clearFilter() {
    this.inputTarget.value = "";
    this.selectedValue = "";

    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = "";
    }

    this.closeDropdown();
    this.updateClearButtonVisibility();

    // Notify if this is a category clear
    if (this.nameValue === 'category') {
      document.dispatchEvent(new CustomEvent('category:changed', {
        detail: { category: null }
      }));
    }

    this.triggerFilter();
  }

  updateClearButtonVisibility() {
    if (this.hasClearButtonTarget) {
      if (this.inputTarget.value.trim() !== '') {
        this.clearButtonTarget.classList.remove('hidden');
      } else {
        this.clearButtonTarget.classList.add('hidden');
      }
    }
  }

  triggerFilter() {
    // Dispatch a custom event to trigger the filter
    this.dispatch("filter", {
      detail: {
        name: this.nameValue,
        value: this.selectedValue
      }
    });
  }

  updateFilteredOptions() {
    const container = this.dropdownTarget.querySelector('[data-combobox-target="options"]');
    if (!container) return;

    container.innerHTML = '';

    // Add "Select None" option for category and subcategory
    if ((this.nameValue === 'category' || this.nameValue === 'subcategory') && this.inputTarget.value) {
      const noneOption = document.createElement('div');
      noneOption.className = 'px-3 py-2 cursor-pointer hover:bg-pink-50 transition-colors border-b border-pink-100 text-gray-500 italic';
      noneOption.dataset.action = 'click->combobox#clearFilter';
      noneOption.textContent = 'Nenhuma seleção';
      container.appendChild(noneOption);
    }

    if (this.filteredOptions.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'px-3 py-2 text-gray-500 text-sm';
      noResults.textContent = 'Nenhuma opção encontrada';
      container.appendChild(noResults);
      return;
    }

    this.filteredOptions.forEach(option => {
      const optionElement = document.createElement('div');

      // Style "Create new" options differently
      if (option.startsWith('Criar nova: "')) {
        optionElement.className = 'flex px-3 py-2 cursor-pointer hover:bg-green-50 transition-colors border-l-4 border-green-400 bg-green-25 text-green-700 font-medium';
        optionElement.innerHTML = `<span class="material-icons text-sm mr-2">add</span>${option}`;
      } else {
        optionElement.className = 'px-3 py-2 cursor-pointer hover:bg-pink-50 transition-colors';
        optionElement.textContent = option;
      }

      optionElement.dataset.action = 'click->combobox#selectOption';
      optionElement.dataset.value = option;
      container.appendChild(optionElement);
    });
  }

  updateDisplay() {
    if (this.inputTarget.value) {
      this.inputTarget.classList.remove("text-gray-400");
      this.inputTarget.classList.add("text-gray-900");
    } else {
      this.inputTarget.classList.add("text-gray-400");
      this.inputTarget.classList.remove("text-gray-900");
    }
  }
}
