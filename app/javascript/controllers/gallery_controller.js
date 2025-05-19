import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["mainImage", "thumbnails", "colorButton", "modal", "modalImage", "sizePill"];

  connect() {
    this.productVariants = JSON.parse(this.element.dataset.variants);
    this.colorButtonTargets.forEach(btn => {
      btn.addEventListener("click", (e) => this.changeColor(e));
    });
    const firstVariant = this.productVariants.find(v => v.available && v.images.length > 0) || this.productVariants[0];
    this.currentColorId = firstVariant ? firstVariant.color_id : null;
    this.currentImages = firstVariant && firstVariant.images.length > 0 ? firstVariant.images : [];
    this.currentIndex = 0;
  }

  getCurrentImages() {
    const variant = this.productVariants.find(v => v.available && v.images.length > 0);
    return variant ? variant.images : [];
  }

  changeColor(e) {
    const btn = e.currentTarget;
    if (btn.disabled) return;
    const colorId = parseInt(btn.dataset.colorId);
    this.currentColorId = colorId;
    const variantForImages = this.productVariants.find(v => v.color_id === colorId && v.available && v.images.length > 0);
    if (variantForImages && variantForImages.images.length > 0) {
      this.currentImages = variantForImages.images;
      this.currentIndex = 0;
      this.updateMainImage();
      this.updateThumbnails();
    }
    this.updateSizesForColor(colorId);
    this.colorButtonTargets.forEach(b => {
      if (parseInt(b.dataset.colorId) === colorId) {
        b.classList.add("ring-2", "ring-pink-400");
      } else {
        b.classList.remove("ring-2", "ring-pink-400");
      }
    });
  }

  updateSizesForColor(colorId) {
    this.sizePillTargets.forEach(pill => {
      const sizeId = parseInt(pill.dataset.sizeId);
      const variant = this.productVariants.find(v => v.color_id === colorId && v.size_id === sizeId);
      if (variant) {
        if (variant.available) {
          pill.className = "inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800";
          pill.classList.remove("line-through", "bg-gray-100", "text-gray-400", "opacity-70");
        } else {
          pill.className = "inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-400 line-through";
        }
      } else {
        pill.className = "inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-400 line-through opacity-70";
      }
    });
  }

  previous() {
    if (!this.currentImages || !this.currentImages.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.currentImages.length) % this.currentImages.length;
    this.updateMainImage();
  }

  next() {
    if (!this.currentImages || !this.currentImages.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
    this.updateMainImage();
  }

  updateMainImage() {
    if (this.hasMainImageTarget && this.currentImages.length) {
      this.mainImageTarget.src = this.currentImages[this.currentIndex];
    }
  }

  updateThumbnails() {
    if (this.hasThumbnailsTarget) {
      this.thumbnailsTarget.innerHTML = '';
      this.currentImages.forEach((imgUrl, idx) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.className = "w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-pink-500";
        img.alt = this.mainImageTarget?.alt || '';
        img.addEventListener('click', () => {
          this.currentIndex = idx;
          this.updateMainImage();
        });
        this.thumbnailsTarget.appendChild(img);
      });
    }
  }

  show(e) {
    const imgUrl = e.currentTarget.dataset.imageUrl;
    if (imgUrl && this.hasMainImageTarget) {
      this.mainImageTarget.src = imgUrl;
      const idx = this.currentImages.indexOf(imgUrl);
      if (idx !== -1) {
        this.currentIndex = idx;
      }
    }
  }

  expand() {
    if (!this.hasModalTarget || !this.hasModalImageTarget) return;
    this.modalImageTarget.src = this.currentImages[this.currentIndex];
    this.modalTarget.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    this.modalTarget.addEventListener("click", this.closeModalBound = this.closeModal.bind(this));
  }

  closeModal(e) {
    if (e.target === this.modalTarget || e.target.closest('button[data-action="gallery#closeModal"]')) {
      this.modalTarget.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      this.modalTarget.removeEventListener("click", this.closeModalBound);
    }
  }
}
