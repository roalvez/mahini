class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.integer :price_cents, null: false, default: 0

      t.timestamps
    end
  end
end
