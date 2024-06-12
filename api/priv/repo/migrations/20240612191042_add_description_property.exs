defmodule Api.Repo.Migrations.AddDescriptionProperty do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :description, :text
    end
  end
end
