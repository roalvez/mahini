class SessionsController < ApplicationController
  def new
  end

  def create
    admin = Admin.find_by(email: params[:email])

    if admin&.authenticate(params[:password])
      admin.reset_session_token!
      session[:admin_id] = admin.id
      session[:admin_session_token] = admin.session_token
      redirect_to admin_products_path, notice: "Logged in successfully."
    else
      flash.now[:alert] = "Invalid email or password."
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    current_admin.reset_session_token! if current_admin.present?

    session[:admin_id] = nil
    session[:admin_session_token] = nil
    redirect_to root_path, notice: "Logged out."
  end
end
