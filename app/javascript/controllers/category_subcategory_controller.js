import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["categoryInput", "subcategoryInput"];
  static values = { subcategories: Array };

  connect() {
    console.log("Category subcategory controller connected");
  }

  updateSubcategories() {
    const selectedCategory = this.categoryInputTarget.value.trim();

    if (selectedCategory) {
      // Find subcategories for the selected category
      const matchingSubcategories = this.subcategoriesValue.filter(sub =>
        sub.category && sub.category.name === selectedCategory
      );

      // Get the subcategory combobox controller
      const subcategoryElement = this.subcategoryInputTarget.closest('[data-controller*="combobox"]');
      if (subcategoryElement) {
        const subcategoryController = this.application.getControllerForElementAndIdentifier(subcategoryElement, 'combobox');
        if (subcategoryController) {
          // Update the subcategory options
          const subcategoryNames = matchingSubcategories.map(sub => sub.name);
          subcategoryController.optionsValue = subcategoryNames;
          subcategoryController.filteredOptions = [...subcategoryNames];
          subcategoryController.updateDisplay();
        }
      }
    } else {
      // Clear subcategory options if no category selected
      const subcategoryElement = this.subcategoryInputTarget.closest('[data-controller*="combobox"]');
      if (subcategoryElement) {
        const subcategoryController = this.application.getControllerForElementAndIdentifier(subcategoryElement, 'combobox');
        if (subcategoryController) {
          subcategoryController.optionsValue = [];
          subcategoryController.filteredOptions = [];
          subcategoryController.updateDisplay();
        }
      }
    }
  }
}
