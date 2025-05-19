require 'rails_helper'

RSpec.describe "Admin::Products", type: :request do
  describe "GET /index" do
    subject(:index) do
      get "admin/products/index"
      response
    end

    it { is_expected.to be_successful }
  end
end
