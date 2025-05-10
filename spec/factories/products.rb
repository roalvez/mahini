# frozen_string_literal: true

FactoryBot.define do
  factory :product do
    name { "Sample Product" }
    price { "29.99" }
    description { "This is a sample product description." }

    after(:create) do |product|
      product.images.attach(
        io: File.open(Rails.root.join('spec', 'support', 'assets', 'sample_image.png')),
        filename: 'sample_image.png',
        content_type: 'image/png'
      )
    end
  end
end
