defmodule ApiWeb.Auth.Guardian do
  alias Api.Accounts
  use Guardian, otp_app: :api

  def subject_for_token(%{id: id}, _claims) do
    sub = to_string(id)
    {:ok, sub}
  end

  def subject_for_token(_, _) do
    {:error, :reason_for_error}
  end

  def resource_from_claims(%{"sub" => id}) do
    case Accounts.get_account!(id) do
      nil -> {:error, :reason_for_error}
      resource -> {:ok, resource}
    end
  end

  def resource_from_claims(_claims) do
    {:error, :reason_for_error}
  end

  def create_token(account) do
    {:ok, token, _full_claims} = encode_and_sign(account)

    {:ok, account, token}
  end

  def validate_password(password, hashed_password) do
    Bcrypt.verify_pass(password, hashed_password)
  end

  def authenticate(username, password) do
    case(Accounts.get_account_by_username!(username)) do
      nil ->
        {:error, :unauthorized}

      account ->
        case validate_password(password, account.password) do
          true -> create_token(account)
          false -> {:error, :reason_for_error}
        end
    end
  end
end
