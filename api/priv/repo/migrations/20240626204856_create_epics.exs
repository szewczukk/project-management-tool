defmodule Api.Repo.Migrations.CreateEpics do
  use Ecto.Migration

  def change do
    create table(:epics) do
      add :title, :string
      add :project, references(:projects, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create index(:epics, [:project])
  end
end
