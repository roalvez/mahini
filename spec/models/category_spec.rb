require 'rails_helper'

RSpec.describe Category, type: :model do
  subject(:category) { build(:category) }

  it { is_expected.to have_many(:subcategories).dependent(:destroy) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_uniqueness_of(:name) }
end
