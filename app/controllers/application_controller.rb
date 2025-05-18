class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  helper_method :current_admin, :admin_signed_in?

  private

  def current_admin
    if session[:admin_id] && session[:admin_session_token]
      @current_admin ||= Admin.find_by(id: session[:admin_id], session_token: session[:admin_session_token])
    end
  end

  def admin_signed_in?
    current_admin.present?
  end

  def authenticate_admin!
    unless admin_signed_in?
      redirect_to login_path, alert: "You must be logged in as admin to access this section."
    end
  end
end
