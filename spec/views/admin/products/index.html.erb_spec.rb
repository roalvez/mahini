require 'rails_helper'

RSpec.describe "admin/products/index", type: :view do
  subject do
    render
    rendered
  end

  let(:product) { create(:product) }

  before do
    assign(:products, Kaminari.paginate_array([ product ]).page(1))
    allow(view).to receive(:url_for).and_return("/rails/active_storage/blobs/variant/test.png")
  end

  it { is_expected.to have_content(product.name) }
  it { is_expected.to have_content(product.price) }
end
