class ProductsController < ApplicationController
  def index
    @products = Product.all
  end

  def show
    @product = Product.includes(
      subcategory: :category,
      product_variants: [
        { images_attachments: :blob },
        :color,
        :size
      ]
    ).find(params[:id])

    @category = @product.category
    @subcategory = @product.subcategory
    @variants = @product.product_variants
    @colors = @variants.map(&:color).uniq
    @sizes = @variants.map(&:size).uniq.sort_by { |size| Size::VALID_NAMES.index(size.name.upcase) || Size::VALID_NAMES.length }
    @first_variant_with_images = @variants.find { |v| v.images.attached? }

    # Find the first variant with images and available, or fallback
    @focused_variant = @variants.find { |v| v.available && v.images.attached? } || @variants.first
    @focused_color_id = @focused_variant&.color_id

    # For the view: show all Size::VALID_NAMES, and for each, find the Size object if it exists for this product
    @all_size_names = Size::VALID_NAMES
    @sizes_by_name = @variants.map(&:size).uniq.index_by { |size| size.name.upcase }
  end
end
