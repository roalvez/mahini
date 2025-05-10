import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mainImage"]
  static values = { images: Array }

  connect() {
    this.currentIndex = 0
    if (this.hasImagesValue && this.imagesValue.length > 0) {
      this.updateMainImage()
    }
  }

  show(event) {
    event.preventDefault()
    const clickedUrl = event.currentTarget.dataset.imageUrl
    const newIndex = this.imagesValue.indexOf(clickedUrl)

    if (newIndex !== -1) {
      this.currentIndex = newIndex
      this.updateMainImage()
    }
  }

  previous() {
    if (!this.imagesValue.length) return
    this.currentIndex = (this.currentIndex - 1 + this.imagesValue.length) % this.imagesValue.length
    this.updateMainImage()
  }

  next() {
    if (!this.imagesValue.length) return
    this.currentIndex = (this.currentIndex + 1) % this.imagesValue.length
    this.updateMainImage()
  }

  updateMainImage() {
    this.mainImageTarget.src = this.imagesValue[this.currentIndex]
  }
}
