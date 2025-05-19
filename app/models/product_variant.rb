class ProductVariant < ApplicationRecord
  belongs_to :product
  belongs_to :color
  belongs_to :size
  has_many_attached :images

  validates :product, :color, :size, presence: true
end
