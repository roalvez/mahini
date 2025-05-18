require 'rails_helper'

RSpec.describe "Products", type: :request do
  describe "GET /index" do
    subject(:index) do
      get "/products/index"
      response
    end

    it { is_expected.to be_successful }
  end

  describe "GET /show" do
    subject(:show) do
      get "/products/show"
      response
    end

    it { is_expected.to be_successful }
  end
end
