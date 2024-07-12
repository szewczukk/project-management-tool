defmodule Api.Repo.Migrations.AddAssigneeToTask do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      add :assignee_id, references(:accounts, on_delete: :nothing), null: true
    end
  end
end
