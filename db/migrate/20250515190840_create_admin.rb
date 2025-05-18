class CreateAdmin < ActiveRecord::Migration[8.0]
  def change
    create_table :admins do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :session_token, null: false
      t.timestamps
    end
    add_index :admins, :email, unique: true
    add_index :admins, :session_token, unique: true
  end
end
