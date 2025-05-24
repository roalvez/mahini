class ProductFilterService
  def initialize(params)
    @params = params
  end

  def call
    products = Product.includes(:category, :subcategory, product_variants: { images_attachments: :blob })
    products = apply_filters(products)
    sort_products(products)
  end

  def filter_options
    {
      product_names: Product.distinct.pluck(:name).sort,
      categories: Category.distinct.pluck(:name).sort,
      subcategories: Subcategory.includes(:category).map { |sc| { name: sc.name, category: sc.category.name } },
      availability_options: [
        { value: 'true', label: 'Disponível' },
        { value: 'false', label: 'Indisponível' }
      ]
    }
  end

  private

  attr_reader :params

  def apply_filters(products)
    products = filter_by_name(products)
    products = filter_by_category(products)
    products = filter_by_subcategory(products)
    filter_by_availability(products)
  end

  def filter_by_name(products)
    return products if params[:name].blank?
    products.where("products.name ILIKE ?", "%#{params[:name]}%")
  end

  def filter_by_category(products)
    return products if params[:category].blank?
    products.joins(:category).where(categories: { name: params[:category] })
  end

  def filter_by_subcategory(products)
    return products if params[:subcategory].blank?
    products.joins(:subcategory).where(subcategories: { name: params[:subcategory] })
  end

  def filter_by_availability(products)
    return products if params[:available].blank?
    available_value = params[:available] == 'true'
    products.where(available: available_value)
  end

  def sort_products(products)
    return products.order(created_at: :desc) if params[:sort_by].blank?

    case params[:sort_by]
    when 'id'
      products.order(id: sort_direction)
    when 'name'
      products.order("products.name #{sort_direction}")
    when 'price'
      products.order(price_cents: sort_direction)
    when 'category'
      products.joins(:category).order("categories.name #{sort_direction}")
    when 'subcategory'
      products.joins(:subcategory).order("subcategories.name #{sort_direction}")
    when 'available'
      products.order(available: sort_direction)
    else
      products.order(created_at: :desc)
    end
  end

  def sort_direction
    params[:sort_direction] == 'desc' ? :desc : :asc
  end
end
