def attach_images(product_variant, image_count = 1)
  images = Dir[Rails.root.join('spec/support/assets/products/*')].sample(image_count)
  images.each do |image_path|
    product_variant.images.attach(
      io: File.open(image_path),
      filename: File.basename(image_path),
      content_type: 'image/jpeg'
    )
  end
end

FactoryBot.define do
  factory :product_variant do
    association :product
    association :color
    association :size
    available { true }

    trait :with_image do
      after(:create) do |product_variant|
        attach_images(product_variant)
      end
    end

    trait :with_multiple_images do
      after(:create) do |product_variant|
        attach_images(product_variant, 3)
      end
    end
  end
end
