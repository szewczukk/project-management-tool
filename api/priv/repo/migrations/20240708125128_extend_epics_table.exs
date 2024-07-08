defmodule Api.Repo.Migrations.ExtendEpicsTable do
  use Ecto.Migration

  def change do
    alter table(:epics) do
      add :description, :string, default: ""
      add :priority, :string
      add :status, :string
    end
  end
end
