import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "dropzone", "previews"];
  static values = { maxFiles: { type: Number, default: 5 } };

  connect() {
    console.log("Image upload controller connected");
    this.files = [];
  }

  triggerFileInput() {
    this.inputTarget.click();
  }

  handleFiles(event) {
    const newFiles = Array.from(event.target.files);
    this.addFiles(newFiles);
  }

  handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    this.dropzoneTarget.classList.add('border-pink-500', 'bg-pink-50');
  }

  handleDrop(event) {
    event.preventDefault();
    this.dropzoneTarget.classList.remove('border-pink-500', 'bg-pink-50');

    const droppedFiles = Array.from(event.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));

    this.addFiles(imageFiles);
  }

  addFiles(newFiles) {
    // Validate file count
    if (this.files.length + newFiles.length > this.maxFilesValue) {
      alert(`Você pode adicionar no máximo ${this.maxFilesValue} imagens por variação.`);
      return;
    }

    // Validate file types
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) {
      alert('Apenas arquivos de imagem são permitidos.');
    }

    // Add valid files
    validFiles.forEach(file => {
      this.files.push(file);
      this.createPreview(file, this.files.length - 1);
    });

    this.updateFileInput();
    this.updateDropzone();
  }

  createPreview(file, index) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const previewDiv = document.createElement('div');
      previewDiv.className = 'relative group';
      previewDiv.innerHTML = `
        <img src="${e.target.result}"
             alt="Preview"
             class="w-full h-20 object-cover rounded border-2 border-pink-200">
        <button type="button"
                data-action="click->image-upload#removeFile"
                data-file-index="${index}"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          ×
        </button>
      `;

      this.previewsTarget.appendChild(previewDiv);
      this.previewsTarget.classList.remove('hidden');
    };

    reader.readAsDataURL(file);
  }

  removeFile(event) {
    const fileIndex = parseInt(event.target.dataset.fileIndex);
    const previewDiv = event.target.closest('.relative');

    // Remove file from array
    this.files.splice(fileIndex, 1);

    // Remove preview
    previewDiv.remove();

    // Update file input and indices
    this.updateFileInput();
    this.updateFileIndices();

    // Hide previews container if empty
    if (this.files.length === 0) {
      this.previewsTarget.classList.add('hidden');
    }

    this.updateDropzone();
  }

  updateFileInput() {
    // Create a new DataTransfer object to update the file input
    const dt = new DataTransfer();
    this.files.forEach(file => dt.items.add(file));
    this.inputTarget.files = dt.files;
  }

  updateFileIndices() {
    const buttons = this.previewsTarget.querySelectorAll('[data-file-index]');
    buttons.forEach((button, index) => {
      button.dataset.fileIndex = index;
    });
  }

  updateDropzone() {
    const hasFiles = this.files.length > 0;
    const canAddMore = this.files.length < this.maxFilesValue;

    if (!canAddMore) {
      this.dropzoneTarget.innerHTML = `
        <span class="material-icons text-4xl text-gray-400 mb-2">check_circle</span>
        <p class="text-gray-600 font-medium">Máximo de imagens atingido</p>
      `;
      this.dropzoneTarget.classList.add('pointer-events-none');
    } else if (hasFiles) {
      this.dropzoneTarget.innerHTML = `
        <span class="material-icons text-2xl text-pink-400 mb-1">add_photo_alternate</span>
        <p class="text-pink-600 text-sm">Adicionar mais imagens (${this.files.length}/${this.maxFilesValue})</p>
      `;
    }
  }
}
