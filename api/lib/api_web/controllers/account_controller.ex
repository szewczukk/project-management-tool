defmodule ApiWeb.AccountController do
  use ApiWeb, :controller

  alias ApiWeb.Auth.Guardian
  alias Api.Accounts
  alias Api.Accounts.Account

  action_fallback ApiWeb.FallbackController

  def index(conn, _params) do
    accounts = Accounts.list_accounts()
    render(conn, :index, accounts: accounts)
  end

  def create(conn, %{"account" => account_params}) do
    with {:ok, %Account{} = account} <- Accounts.create_account(account_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/accounts/#{account}")
      |> render(:show, account: account)
    end
  end

  def show(conn, %{"id" => id}) do
    account = Accounts.get_account!(id)
    render(conn, :show, account: account)
  end

  def update(conn, %{"id" => id, "account" => account_params}) do
    account = Accounts.get_account!(id)

    with {:ok, %Account{} = account} <- Accounts.update_account(account, account_params) do
      render(conn, :show, account: account)
    end
  end

  def delete(conn, %{"id" => id}) do
    account = Accounts.get_account!(id)

    with {:ok, %Account{}} <- Accounts.delete_account(account) do
      send_resp(conn, :no_content, "")
    end
  end

  def sign_in(conn, %{"credentials" => credentials}) do
    case Guardian.authenticate(Map.get(credentials, "username"), Map.get(credentials, "password")) do
      {:ok, _, token} ->
        conn
        |> put_status(:ok)
        |> render(:token, token: token)

      {:error, reason} ->
        conn
        |> put_status(:unauthorized)
        |> render(:error, error: reason)
    end
  end

  def me(conn, _params) do
    if Guardian.Plug.authenticated?(conn) do
      account = Guardian.Plug.current_resource(conn)

      render(conn, :show, account: account)
    end
  end
end
