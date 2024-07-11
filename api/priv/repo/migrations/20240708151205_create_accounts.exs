defmodule Api.Repo.Migrations.CreateAccounts do
  use Ecto.Migration

  def change do
    create table(:accounts) do
      add :username, :string
      add :password, :string

      timestamps(type: :utc_datetime)
    end
  end
end
