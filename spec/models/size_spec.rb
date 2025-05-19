require 'rails_helper'

RSpec.describe Size, type: :model do
  subject(:size) { build(:size) }

  it { is_expected.to have_many(:product_variants) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_uniqueness_of(:name) }
  it { is_expected.to validate_inclusion_of(:name).in_array(Size::VALID_NAMES) }
end
