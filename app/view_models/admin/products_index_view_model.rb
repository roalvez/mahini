class Admin::ProductsIndexViewModel
  def initialize(params)
    @params = params
    @service = Admin::ProductFilterService.new(params)
  end

  def products
    @products ||= @service.call.page(@params[:page]).per(10)
  end

  def filter_options
    @filter_options ||= @service.filter_options
  end

  # View-specific helper methods
  def current_availability_label
    return nil if @params[:available].blank?

    availability_option = filter_options[:availability_options].find do |opt|
      opt[:value] == @params[:available]
    end
    availability_option&.dig(:label)
  end

  def has_active_filters?
    [@params[:name], @params[:category], @params[:subcategory], @params[:available]].any?(&:present?)
  end

  def filter_summary
    filters = []
    filters << "Nome: #{@params[:name]}" if @params[:name].present?
    filters << "Categoria: #{@params[:category]}" if @params[:category].present?
    filters << "Subcategoria: #{@params[:subcategory]}" if @params[:subcategory].present?
    filters << "Disponibilidade: #{current_availability_label}" if @params[:available].present?
    filters.join(" | ")
  end

  def sort_direction_for(column)
    return 'asc' unless @params[:sort_by] == column
    @params[:sort_direction] == 'asc' ? 'desc' : 'asc'
  end

  def sorted_by?(column)
    @params[:sort_by] == column
  end

  def current_sort_direction
    @params[:sort_direction] || 'desc'
  end

  private

  attr_reader :params
end
