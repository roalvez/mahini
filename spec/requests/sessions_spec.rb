require 'rails_helper'

describe 'Admin Sessions', type: :request do
  let(:admin) { create(:admin, password: 'password123') }
  let(:password) { 'password123' }

  describe 'POST /login' do
    subject(:login) do
      post login_path, params: { email: admin.email, password: }
      response
    end

    context 'with valid credentials' do
      it { is_expected.to redirect_to(admin_products_path) }

      it do
        subject
        follow_redirect!
        expect(response.body).to include('Logged in successfully')
      end
    end

    context 'with invalid credentials' do
      let(:password) { 'wrongpassword' }

      it do
        subject
        expect(response.body).to include('Invalid email or password')
      end
    end
  end

  describe 'DELETE /logout' do
    before do
      delete logout_path
      response
    end

    it { is_expected.to redirect_to(root_path) }

    it do
      follow_redirect!
      expect(response.body).to include('Logged out')
    end
  end
end
