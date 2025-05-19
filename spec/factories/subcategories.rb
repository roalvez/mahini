FactoryBot.define do
  factory :subcategory do
    name { Faker::Commerce.material }
    association :category
  end
end
