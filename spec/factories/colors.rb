FactoryBot.define do
  factory :color do
    name { Faker::Color.color_name }
    hex { Faker::Color.hex_color }
  end
end
