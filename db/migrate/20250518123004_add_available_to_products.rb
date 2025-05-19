class AddAvailableToProducts < ActiveRecord::Migration[7.0]
  def change
    add_column :products, :available, :boolean, default: true, null: false
    add_reference :products, :subcategory, foreign_key: true
  end
end
