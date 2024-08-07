defmodule ApiWeb.Router do
  use ApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug ApiWeb.Auth.GuardianPipeline
  end

  scope "/api", ApiWeb do
    pipe_through :api

    resources "/projects", ProjectController do
      resources "/epics", EpicController do
        resources "/tasks", TaskController
      end

      resources "/tasks", TaskController
    end

    resources "/tasks", TaskController, only: [:update, :delete, :show]
    resources "/epics", EpicController, only: [:update, :delete, :show]
    resources "/accounts", AccountController
    post "/signin", AccountController, :sign_in
  end

  scope "/api", ApiWeb do
    pipe_through [:api, :auth]

    get "/me", AccountController, :me
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:api, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: ApiWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
