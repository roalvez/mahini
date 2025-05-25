# frozen_string_literal: true

class Product < ApplicationRecord
  has_many_attached :images
  monetize :price_cents

  belongs_to :subcategory
  has_one :category, through: :subcategory
  has_many :product_variants, dependent: :destroy
  has_many :colors, through: :product_variants
  has_many :sizes, through: :product_variants

  validates :name, :price_cents, presence: true

  accepts_nested_attributes_for :product_variants,
                                allow_destroy: true,
                                reject_if: :all_blank
end
