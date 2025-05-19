class Admin::ProductsController < ApplicationController
  def index
    @products = Product.order(created_at: :desc).page(params[:page]).per(10)
  end
end
