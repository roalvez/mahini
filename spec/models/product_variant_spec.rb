require 'rails_helper'

RSpec.describe ProductVariant, type: :model do
  subject(:product_variant) { build(:product_variant) }

  it { is_expected.to belong_to(:product) }
  it { is_expected.to belong_to(:color) }
  it { is_expected.to belong_to(:size) }
  it { is_expected.to have_many_attached(:images) }
  it { is_expected.to validate_presence_of(:product) }
  it { is_expected.to validate_presence_of(:color) }
  it { is_expected.to validate_presence_of(:size) }
end
