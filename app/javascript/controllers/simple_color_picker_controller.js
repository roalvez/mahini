import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["colorInput", "displayInput"];
  static values = { variantIndex: String };

  connect() {
    this.updateDisplay();
  }

  updateColor() {
    this.updateDisplay();
    this.updateNewColorFields();
  }

  updateDisplay() {
    if (this.hasColorInputTarget && this.hasDisplayInputTarget) {
      this.displayInputTarget.value = this.colorInputTarget.value;
    }
  }

  updateNewColorFields() {
    // Update the new color fields in the product variant
    const variantIndex = this.variantIndexValue;
    const hex = this.colorInputTarget.value;

    // Trigger an event that the product variants controller can listen to
    const event = new CustomEvent('newColorChanged', {
      detail: { variantIndex, hex },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }
}
