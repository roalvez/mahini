require 'rails_helper'

RSpec.describe Color, type: :model do
  subject(:color) { build(:color) }

  it { is_expected.to have_many(:product_variants) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_uniqueness_of(:name) }
end
