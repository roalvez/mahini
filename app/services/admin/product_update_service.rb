# frozen_string_literal: true

class Admin::ProductUpdateService
  attr_reader :product, :errors

  def initialize(product, params)
    @product = product
    @params = params
    @errors = []
  end

  def call
    ActiveRecord::Base.transaction do
      update_product
      handle_category_and_subcategory
      handle_product_variants

      if @errors.empty?
        true
      else
        raise ActiveRecord::Rollback
      end
    end
  rescue ActiveRecord::Rollback
    false
  end

  private

  attr_reader :params

  def update_product
    @product.assign_attributes(
      name: params[:name],
      price: parse_price(params[:price]),
      available: params[:available] == '1'
    )
  end

  def handle_category_and_subcategory
    if params[:category_name].present?
      category = find_or_create_category(params[:category_name])
      subcategory = find_or_create_subcategory(params[:subcategory_name], category)
      @product.subcategory = subcategory
    end

    unless @product.save
      @errors.concat(@product.errors.full_messages)
    end
  end

  def handle_product_variants
    return if params[:product_variants_attributes].blank?

    params[:product_variants_attributes].each do |index, variant_attrs|
      if variant_attrs[:_destroy] == '1' && variant_attrs[:id].present?
        variant = @product.product_variants.find(variant_attrs[:id])
        variant.destroy
        next
      end

      color = handle_color(variant_attrs)
      next unless color

      update_or_create_variants_for_sizes(variant_attrs, color)
    end
  end

  def handle_color(variant_attrs)
    if variant_attrs[:color_id].present?
      Color.find(variant_attrs[:color_id])
    elsif variant_attrs[:color_name].present?
      Color.find_or_create_by(name: variant_attrs[:color_name]) do |color|
        color.hex = variant_attrs[:color_hex] if variant_attrs[:color_hex].present?
      end
    end
  end

  def update_or_create_variants_for_sizes(variant_attrs, color)
    size_ids = Array(variant_attrs[:size_ids]).reject(&:blank?)

    # Remove existing variants for this color that aren't in the new size list
    existing_variants = @product.product_variants.where(color: color)
    existing_variants.where.not(size_id: size_ids).destroy_all

    return if size_ids.empty?

    size_ids.each do |size_id|
      variant = @product.product_variants.find_or_initialize_by(
        color: color,
        size_id: size_id
      )

      variant.available = variant_attrs[:available] == '1'

      unless variant.save
        @errors.concat(variant.errors.full_messages)
      end
    end

    # Handle new images - attach to the first variant of this color
    if variant_attrs[:images].present?
      first_variant = @product.product_variants.where(color: color).first
      variant_attrs[:images].each do |image|
        first_variant.images.attach(image) if image.present? && first_variant
      end
    end
  end

  def find_or_create_category(name)
    Category.find_or_create_by(name: name.strip)
  end

  def find_or_create_subcategory(name, category)
    return category.subcategories.first if name.blank?

    category.subcategories.find_or_create_by(name: name.strip)
  end

  def parse_price(price_string)
    return 0 if price_string.blank?

    # Remove currency symbols and convert comma to dot
    cleaned_price = price_string.to_s.gsub(/[R$\s.]/, '').gsub(',', '.')
    (cleaned_price.to_f * 100).to_i # Convert to cents
  end
end
