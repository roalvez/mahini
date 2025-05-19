FactoryBot.define do
  factory :size do
    name { Size::VALID_NAMES.sample }
  end
end
