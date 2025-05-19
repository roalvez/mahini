require 'rails_helper'

describe Admin, type: :model do
  subject { build(:admin) }

  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email) }
  it { is_expected.to validate_uniqueness_of(:session_token) }
  it { is_expected.to have_secure_password }

  describe 'session token' do
    let(:admin) { build(:admin, session_token: nil) }
    let!(:existing_admin) { create(:admin, session_token: 'token123') }
    let(:duplicate_token_admin) { build(:admin, session_token: 'token123') }

    it 'generates a session_token before validation' do
      admin.valid?
      expect(admin.session_token).not_to be_nil
    end

    it 'ensures session_token is unique' do
      expect(duplicate_token_admin).not_to be_valid
    end
  end

  describe '#reset_session_token!' do
    subject(:reset_session_token) { admin.reset_session_token! }

    let!(:admin) { create(:admin) }
    let(:old_token) { admin.session_token }

    it do
      expect { subject }.to change { admin.reload.session_token }.from(old_token)
    end
  end
end
