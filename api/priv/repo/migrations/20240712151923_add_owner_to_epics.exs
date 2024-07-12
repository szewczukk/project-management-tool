defmodule Api.Repo.Migrations.AddOwnerToEpics do
  use Ecto.Migration

  def change do
    alter table(:epics) do
      add :owner_id, references(:accounts, on_delete: :nothing)
    end
  end
end
