import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["variantsContainer", "variantTemplate"];
  static values = { colors: Array, sizes: Array };

  connect() {
    console.log("Product variants controller connected");
    this.variantIndex = 0;

    // Add initial variant
    this.addVariant();
  }  addVariant() {
    const template = this.variantTemplateTarget.content.cloneNode(true);
    const variantDiv = template.querySelector('[data-variant-index]');

    // Replace INDEX_PLACEHOLDER with actual index
    this.updateVariantIndices(variantDiv, this.variantIndex);

    // Setup event listeners for color mode toggling
    this.setupColorModeListeners(variantDiv);

    // Populate sizes checkboxes
    this.populateSizesCheckboxes(variantDiv);

    this.variantsContainerTarget.appendChild(template);
    this.variantIndex++;

    // Setup size checkboxes styling
    this.setupSizeCheckboxes(variantDiv);
  }

  setupColorModeListeners(variantDiv) {
    const variantIndex = variantDiv.dataset.variantIndex;

    // Add event listeners for color mode radio buttons
    const existingRadio = variantDiv.querySelector('input[value="existing"]');
    const newRadio = variantDiv.querySelector('input[value="new"]');

    if (existingRadio) {
      existingRadio.addEventListener('change', (event) => {
        if (event.target.checked) {
          this.toggleColorMode(variantIndex, 'existing');
        }
      });
    }

    if (newRadio) {
      newRadio.addEventListener('change', (event) => {
        if (event.target.checked) {
          this.toggleColorMode(variantIndex, 'new');
        }
      });
    }

    // Listen for color selection events from the color combobox
    variantDiv.addEventListener('colorSelected', (event) => {
      this.handleExistingColorSelected(event.detail.variantIndex, event.detail.color);
    });

    variantDiv.addEventListener('colorCleared', (event) => {
      this.handleColorCleared(event.detail.variantIndex);
    });

    // Listen for new color picker events
    variantDiv.addEventListener('newColorChanged', (event) => {
      this.handleNewColorChanged(event.detail.variantIndex, event.detail.hex);
    });

    // Add event listeners for new color inputs
    const newColorNameInput = variantDiv.querySelector('input[name*="[new_color_name]"]');

    if (newColorNameInput) {
      newColorNameInput.addEventListener('input', () => {
        this.updateNewColorFields(variantIndex);
      });
    }
  }

  removeVariant(event) {
    const variantDiv = event.target.closest('[data-variant-index]');

    // If this is an existing variant, mark for deletion
    const destroyInput = variantDiv.querySelector('input[name*="[_destroy]"]');
    if (destroyInput) {
      destroyInput.value = '1';
      variantDiv.style.display = 'none';
    } else {
      // If it's a new variant, just remove it
      variantDiv.remove();
    }

    this.updateVariantTitles();
  }

  updateVariantTitles() {
    // Update variant titles to show correct numbering
    const visibleVariants = this.variantsContainerTarget.querySelectorAll('[data-variant-index]:not([style*="display: none"])');
    visibleVariants.forEach((variant, index) => {
      const title = variant.querySelector('h3');
      if (title) {
        title.textContent = `Variação ${index + 1}`;
      }
    });
  }

  setupSizeCheckboxes(variantDiv) {
    const checkboxes = variantDiv.querySelectorAll('input[type="checkbox"][name*="[size_ids]"]');

    checkboxes.forEach(checkbox => {
      const label = checkbox.closest('label');

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          label.classList.add('bg-pink-100', 'border-pink-400', 'text-pink-800');
          label.classList.remove('border-pink-200');
        } else {
          label.classList.remove('bg-pink-100', 'border-pink-400', 'text-pink-800');
          label.classList.add('border-pink-200');
        }
      });
    });
  }

  updateVariantIndices(element, newIndex) {
    // Update data attribute
    element.setAttribute('data-variant-index', newIndex);

    // Update all input names
    const inputs = element.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.name && input.name.includes('INDEX_PLACEHOLDER')) {
        input.name = input.name.replace('INDEX_PLACEHOLDER', newIndex);
      }
    });
  }

  populateSizesCheckboxes(variantDiv) {
    const sizesContainer = variantDiv.querySelector('[data-product-variants-target="sizesContainer"]');
    if (!sizesContainer || !this.sizesValue) return;

    // Clear existing checkboxes
    sizesContainer.innerHTML = '';

    // Add size checkboxes
    this.sizesValue.forEach(size => {
      const labelElement = document.createElement('label');
      labelElement.className = 'flex items-center justify-center p-2 border border-pink-200 rounded-md cursor-pointer transition-colors duration-200';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = `product[product_variants_attributes][${variantDiv.dataset.variantIndex}][size_ids][]`;
      checkbox.value = size.id;
      checkbox.className = 'sr-only';

      const span = document.createElement('span');
      span.className = 'text-sm font-medium text-pink-700';
      span.textContent = size.name;

      labelElement.appendChild(checkbox);
      labelElement.appendChild(span);
      sizesContainer.appendChild(labelElement);
    });
  }

  toggleColorMode(variantIndex, mode) {
    const variantDiv = document.querySelector(`[data-variant-index="${variantIndex}"]`);
    if (!variantDiv) return;

    const existingSection = variantDiv.querySelector('.existing-color-section');
    const newSection = variantDiv.querySelector('.new-color-section');

    if (mode === 'existing') {
      if (existingSection) existingSection.classList.remove('hidden');
      if (newSection) newSection.classList.add('hidden');

      // Clear new color inputs
      const colorNameInput = variantDiv.querySelector('input[name*="[new_color_name]"]');
      const colorHexInput = variantDiv.querySelector('input[name*="[new_color_hex]"]');
      if (colorNameInput) colorNameInput.value = '';
      if (colorHexInput) colorHexInput.value = '#ffffff';

    } else if (mode === 'new') {
      if (existingSection) existingSection.classList.add('hidden');
      if (newSection) newSection.classList.remove('hidden');

      // Clear existing color selection
      const colorSelect = variantDiv.querySelector('select[name*="[color_id]"]');
      if (colorSelect) colorSelect.value = '';
    }

    this.updateVariantHiddenFields(variantIndex);
  }  handleExistingColorSelected(variantIndex, color) {
    this.updateVariantHiddenFields(variantIndex, color);
  }

  handleColorCleared(variantIndex) {
    this.updateVariantHiddenFields(variantIndex);
  }

  handleNewColorChanged(variantIndex, hex) {
    const variantDiv = document.querySelector(`[data-variant-index="${variantIndex}"]`);
    if (!variantDiv) return;

    const newColorNameInput = variantDiv.querySelector('input[name*="[new_color_name]"]');

    if (newColorNameInput && newColorNameInput.value.trim()) {
      this.updateVariantHiddenFields(variantIndex, {
        name: newColorNameInput.value.trim(),
        hex: hex
      });
    }
  }

  updateNewColorFields(variantIndex) {
    // Update hidden fields when new color inputs change
    const variantDiv = document.querySelector(`[data-variant-index="${variantIndex}"]`);
    if (!variantDiv) return;

    const newColorNameInput = variantDiv.querySelector('input[name*="[new_color_name]"]');
    const newColorHexInput = variantDiv.querySelector('input[name*="[new_color_hex]"]');

    if (newColorNameInput && newColorHexInput) {
      this.updateVariantHiddenFields(variantIndex, {
        name: newColorNameInput.value,
        hex: newColorHexInput.value
      });
    }
  }

  updateVariantHiddenFields(variantIndex, color = null) {
    const variantDiv = document.querySelector(`[data-variant-index="${variantIndex}"]`);
    if (!variantDiv) return;

    const colorNameInput = variantDiv.querySelector(`[data-variant-color-name="${variantIndex}"]`);
    const colorHexInput = variantDiv.querySelector(`[data-variant-color-hex="${variantIndex}"]`);

    if (color) {
      // Color selected (existing or new)
      if (colorNameInput) colorNameInput.value = color.name || '';
      if (colorHexInput) colorHexInput.value = color.hex || '';
    } else {
      // No color selected
      if (colorNameInput) colorNameInput.value = '';
      if (colorHexInput) colorHexInput.value = '';
    }
  }
}
