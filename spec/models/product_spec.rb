require 'rails_helper'

RSpec.describe Product, type: :model do
  subject(:product) { build(:product) }

  it { is_expected.to belong_to(:subcategory) }
  it { is_expected.to have_one(:category).through(:subcategory) }
  it { is_expected.to have_many(:product_variants).dependent(:destroy) }
  it { is_expected.to have_many(:colors).through(:product_variants) }
  it { is_expected.to have_many(:sizes).through(:product_variants) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:price_cents) }
end
