class Admin::ProductsController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_product, only: [:show, :edit, :update, :destroy]

  def index
    @service = ProductFilterService.new(params)
    @products = @service.call.page(params[:page]).per(10)
    @filter_options = @service.filter_options
    @filter_params = filter_params
  end

  def show
  end

  def new
    @product = Product.new
    @product.product_variants.build
    @form_data = build_form_data
  end

  def edit
    @form_data = build_form_data
  end

  def create
    @service = Admin::ProductCreationService.new(product_params)

    if @service.call
      redirect_to admin_products_path, notice: 'Produto criado com sucesso!'
    else
      @product = @service.product
      @form_data = build_form_data
      render :new, status: :unprocessable_entity
    end
  end

  def update
    @service = Admin::ProductUpdateService.new(@product, product_params)

    if @service.call
      redirect_to admin_products_path, notice: 'Produto atualizado com sucesso!'
    else
      @form_data = build_form_data
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    redirect_to admin_products_path, notice: 'Produto removido com sucesso!'
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def build_form_data
    begin
      {
        categories: Category.all.order(:name).map do |category|
          {
            id: category.id,
            name: category.name
          }
        end,
        subcategories: Subcategory.all.includes(:category).order(:name).map do |subcategory|
          {
            id: subcategory.id,
            name: subcategory.name,
            category: {
              id: subcategory.category.id,
              name: subcategory.category.name
            }
          }
        end,
        colors: Color.all.order(:name).map do |color|
          {
            id: color.id,
            name: color.name,
            hex: color.hex
          }
        end,
        sizes: Size.all.order(:name).map do |size|
          {
            id: size.id,
            name: size.name
          }
        end
      }
    rescue => e
      # Return empty arrays as fallback
      {
        categories: [],
        subcategories: [],
        colors: [],
        sizes: []
      }
    end
  end

  def product_params
    params.require(:product).permit(
      :name, :price, :available,
      product_variants_attributes: [
        :id, :available, :color_id, :color_name, :color_hex, :_destroy,
        size_ids: [],
        images: []
      ]
    ).tap do |permitted_params|
      # Add category and subcategory names from separate fields
      permitted_params[:category_name] = params[:category_name] if params[:category_name].present?
      permitted_params[:subcategory_name] = params[:subcategory_name] if params[:subcategory_name].present?
    end
  end

  def filter_params
    params.permit(:name, :category, :subcategory, :available, :sort_by, :sort_direction, :page, :turbo_frame)
  end
end
