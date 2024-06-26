defmodule Api.Repo.Migrations.RenameProjectToProjectId do
  use Ecto.Migration

  def change do
    rename table("epics"), :project, to: :project_id
  end
end
