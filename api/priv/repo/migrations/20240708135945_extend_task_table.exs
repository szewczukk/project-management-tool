defmodule Api.Repo.Migrations.ExtendTaskTable do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      add :description, :string, default: ""
      add :priority, :string
      add :started_at, :utc_datetime, null: true
      add :completed_at, :utc_datetime, null: true
    end
  end
end
