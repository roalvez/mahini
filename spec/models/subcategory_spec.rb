require 'rails_helper'

RSpec.describe Subcategory, type: :model do
  subject(:subcategory) { build(:subcategory) }

  it { is_expected.to belong_to(:category) }
  it { is_expected.to have_many(:products).dependent(:nullify) }
  it { is_expected.to validate_presence_of(:name) }
  it {
    is_expected.to validate_uniqueness_of(:name).scoped_to(:category_id)
  }
end
