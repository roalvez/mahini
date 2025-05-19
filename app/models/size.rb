class Size < ApplicationRecord
  VALID_NAMES = %w[PP P M G GG XG XXG].freeze

  has_many :product_variants, dependent: :destroy

  validates :name, presence: true, uniqueness: true, inclusion: { in: VALID_NAMES }
end
