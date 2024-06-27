defmodule Api.Repo.Migrations.AddForeignKeysToTask do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      add :project_id, references(:projects, on_delete: :nothing)
      add :epic_id, references(:epics, on_delete: :nothing)
    end
  end
end
