# frozen_string_literal: true

FactoryBot.define do
  factory :admin do
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    session_token { SecureRandom.urlsafe_base64(32) }
  end
end
