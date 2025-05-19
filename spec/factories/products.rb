# frozen_string_literal: true

FactoryBot.define do
  factory :product do
    name { Faker::Commerce.product_name }
    price { Faker::Commerce.price(range: 10..100.0) }
    description { Faker::Lorem.paragraph(sentence_count: 2) }
    available { true }
    association :subcategory
  end
end
