require 'rails_helper'

describe ApplicationController, type: :controller do
  controller do
    def index
      render plain: 'OK'
    end
  end

  describe 'filters and helpers' do
    subject do
      get :index
      response
    end

    it { is_expected.to be_successful }
  end

  describe '#current_admin' do
    subject(:current_admin) { controller.send(:current_admin) }

    let!(:admin) { create(:admin) }

    context 'when admin is logged in' do
      before do
        session[:admin_id] = admin.id
        session[:admin_session_token] = admin.session_token
      end

      it { is_expected.to eq(admin) }
    end

    context 'when admin is not logged in' do
      before { session[:admin_id] = nil }

      it { is_expected.to be_nil }
    end
  end

  describe '#admin_signed_in?' do
    subject(:admin_signed_in?) { controller.send(:admin_signed_in?) }

    let(:admin) { create(:admin) }

    context 'when admin is logged in' do
      before do
        session[:admin_id] = admin.id
        session[:admin_session_token] = admin.session_token
      end

      it { is_expected.to be true }
    end

    context 'when admin is not logged in' do
      before { session[:admin_id] = nil }

      it { is_expected.to be false }
    end
  end

  describe '#authenticate_admin!' do
    subject(:authenticate_admin!) { controller.send(:authenticate_admin!) }

    controller do
      before_action :authenticate_admin!

      def secret
        render plain: 'Secret!'
      end
    end

    before do
      routes.draw { get "secret" => "anonymous#secret" }
    end

    context 'when admin is logged in' do
      let(:admin) { create(:admin) }

      before do
        session[:admin_id] = admin.id
        session[:admin_session_token] = admin.session_token
      end

      it { is_expected.to be_nil }
    end

    context 'when admin is not logged in' do
      before { get :secret }

      it do
        expect(response).to redirect_to('/login')
        expect(flash[:alert]).to eq('You must be logged in as admin to access this section.')
      end
    end
  end
end
