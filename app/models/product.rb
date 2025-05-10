# frozen_string_literal: true

class Product < ApplicationRecord
  has_many_attached :images
  monetize :price_cents

  validates :name, :price_cents, presence: true
end
