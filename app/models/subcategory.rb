class Subcategory < ApplicationRecord
  belongs_to :category
  has_many :products, dependent: :nullify
  validates :name, presence: true, uniqueness: { scope: :category_id }
end
