defmodule ApiWeb.AccountJSON do
  alias Api.Accounts.Account

  @doc """
  Renders a list of accounts.
  """
  def index(%{accounts: accounts}) do
    %{data: for(account <- accounts, do: data(account))}
  end

  @doc """
  Renders a single account.
  """
  def show(%{account: account}) do
    %{data: data(account)}
  end

  def token(%{token: token}) do
    %{data: %{token: token}}
  end

  defp data(%Account{} = account) do
    %{
      id: account.id,
      username: account.username
    }
  end
end
