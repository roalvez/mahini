FactoryBot.define do
  factory :category do
    name { Faker::Commerce.department(max: 1, fixed_amount: true) }
  end
end
