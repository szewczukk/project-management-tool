defmodule ApiWeb.Auth.GuardianPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :elixir_api_jwt,
    module: ApiWeb.Auth.Guardian,
    error_handler: ApiWeb.Auth.GuardianErrorHandler

  plug Guardian.Plug.VerifyHeader
  plug Guardian.Plug.VerifySession
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
