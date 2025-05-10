require 'rails_helper'

RSpec.describe Product, type: :model do
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:price_cents) }
  it { should have_many_attached(:images) }
end
