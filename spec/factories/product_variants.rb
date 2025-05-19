FactoryBot.define do
  factory :product_variant do
    association :product
    association :color
    association :size
    available { true }
    # To attach images, use after(:create) in specs as needed
  end
end
