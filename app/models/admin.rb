class Admin < ApplicationRecord
  has_secure_password

  before_validation :ensure_session_token

  validates :email, presence: true, uniqueness: true
  validates :session_token, presence: true, uniqueness: true

  def reset_session_token!
    self.update!(session_token: generate_unique_session_token)
  end

  private

  def ensure_session_token
    self.session_token ||= generate_unique_session_token
  end

  def generate_unique_session_token
    loop do
      token = SecureRandom.urlsafe_base64(32)
      break token unless Admin.exists?(session_token: token)
    end
  end
end
