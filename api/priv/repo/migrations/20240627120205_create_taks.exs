defmodule Api.Repo.Migrations.Createtasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :title, :string
      add :status, :string

      timestamps(type: :utc_datetime)
    end
  end
end
