import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [];

  connect() {
    console.log("Product form controller connected");
  }

  formatPrice(event) {
    let value = event.target.value;

    // Remove any non-digit characters except comma and dot
    value = value.replace(/[^\d,\.]/g, '');

    // Replace comma with dot for decimal separator
    value = value.replace(',', '.');

    // Format as Brazilian currency
    if (value && !isNaN(parseFloat(value))) {
      const numericValue = parseFloat(value);
      event.target.value = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }

  validateForm(event) {
    const form = event.target;
    const productName = form.querySelector('input[name="product[name]"]').value.trim();
    const productPrice = form.querySelector('input[name="product[price]"]').value.trim();

    if (!productName) {
      event.preventDefault();
      alert('Por favor, preencha o nome do produto.');
      return false;
    }

    if (!productPrice) {
      event.preventDefault();
      alert('Por favor, preencha o preço do produto.');
      return false;
    }

    // Check if at least one variant has been added
    const variantContainers = form.querySelectorAll('[data-variant-index]');
    if (variantContainers.length === 0) {
      event.preventDefault();
      alert('Por favor, adicione pelo menos uma variação do produto.');
      return false;
    }

    return true;
  }
}
