defmodule Api.Epics.Epic do
  use Ecto.Schema
  import Ecto.Changeset

  schema "epics" do
    field :title, :string
    belongs_to :project, Api.Projects.Project
    has_many :tasks, Api.Tasks.Task

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(epic, attrs) do
    epic
    |> cast(attrs, [:title, :project_id])
    |> validate_required([:title, :project_id])
  end
end
