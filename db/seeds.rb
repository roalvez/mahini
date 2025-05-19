require 'factory_bot_rails'

# Seed categories and subcategories
categories = %w[Roupas Calçados Acessórios]
categories.each do |cat_name|
  category = Category.find_or_create_by!(name: cat_name)
  2.times do |i|
    Subcategory.find_or_create_by!(name: "#{cat_name} Sub#{i+1}", category: category)
  end
end

# Seed sizes
Size::VALID_NAMES.each do |size_name|
  Size.find_or_create_by!(name: size_name)
end

# Seed colors
%w[vermelho azul verde preto branco amarelo rosa].each do |color_name|
  Color.find_or_create_by!(name: color_name, hex: Faker::Color.hex_color)
end

# Seed products with variants
Subcategory.all.each do |subcategory|
  3.times do
    product = Product.create!(
      name: Faker::Commerce.product_name,
      price: Faker::Commerce.price(range: 10..100.0, as_string: true),
      description: Faker::Lorem.paragraph(sentence_count: 2),
      available: true,
      subcategory: subcategory
    )
    Color.limit(2).each do |color|
      Size.all.sample(3).each do |size|
        variant = ProductVariant.create!(
          product: product,
          color: color,
          size: size,
          available: [ true, true, false ].sample
        )
        Dir.glob(Rails.root.join('spec', 'support', 'assets', 'products', '*.{png,jpg,jpeg}')).sample(2).each do
          variant.images.attach(
            io: File.open(_1),
            filename: File.basename(_1),
            content_type: Marcel::MimeType.for(Pathname.new(_1))
          )
        end
      end
    end
  end
end
