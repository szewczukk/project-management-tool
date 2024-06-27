defmodule Api.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :title, :string
    field :status, Ecto.Enum, values: [:todo, :inprogress, :done]
    belongs_to :project, Api.Projects.Project
    belongs_to :epic, Api.Epics.Epic

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :status, :project_id, :epic_id])
    |> validate_required([:title, :status, :project_id])
  end
end
