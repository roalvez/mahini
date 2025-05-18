require 'rails_helper'

describe SessionsController, type: :controller do
  let(:admin) { create(:admin, password: 'password123') }

  describe 'POST #create (login)' do
    subject { post :create, params: { email: admin.email, password: 'password123' } }

    context 'with valid credentials' do
      it { is_expected.to redirect_to(admin_products_path) }

      describe 'session' do
        before { subject }

        it { expect(session[:admin_id]).to eq(admin.id) }
        it { expect(session[:admin_session_token]).to eq(admin.reload.session_token) }
      end

      describe 'flash notice' do
        before { subject }

        it { expect(flash[:notice]).to eq('Logged in successfully.') }
      end
    end

    context 'with invalid credentials' do
      subject { post :create, params: { email: admin.email, password: 'wrongpassword' } }

      it { is_expected.to_not redirect_to(admin_products_path) }


      it 'does not set admin_id in session' do
        subject
        expect(session[:admin_id]).to be_nil
      end

      it 'does not set admin_session_token in session' do
        subject
        expect(session[:admin_session_token]).to be_nil
      end

      it 'sets flash alert' do
        subject
        expect(flash[:alert]).to eq('Invalid email or password.')
      end
    end
  end

  describe 'DELETE #destroy (logout)' do
    before do
      post :create, params: { email: admin.email, password: 'password123' }
    end

    subject { delete :destroy }

    it { is_expected.to redirect_to(root_path) }

    it 'clears admin_id from session' do
      subject
      expect(session[:admin_id]).to be_nil
    end

    it 'clears admin_session_token from session' do
      subject
      expect(session[:admin_session_token]).to be_nil
    end

    it 'sets flash notice' do
      subject
      expect(flash[:notice]).to eq('Logged out.')
    end
  end
end
