class Admin::ProductsController < ApplicationController
  def index
    @service = ProductFilterService.new(params)
    @products = @service.call.page(params[:page]).per(10)
    @filter_options = @service.filter_options
    @filter_params = filter_params
  end

  private

  def filter_params
    params.permit(:name, :category, :subcategory, :available, :sort_by, :sort_direction, :page, :turbo_frame)
  end
end
