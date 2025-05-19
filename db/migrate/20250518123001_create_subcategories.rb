class CreateSubcategories < ActiveRecord::Migration[7.0]
  def change
    create_table :subcategories do |t|
      t.string :name, null: false
      t.references :category, null: false, foreign_key: true
      t.timestamps
    end
    add_index :subcategories, [ :category_id, :name ], unique: true
  end
end
