defmodule Api.Epics.Epic do
  use Ecto.Schema
  import Ecto.Changeset

  schema "epics" do
    field :title, :string
    field :description, :string
    field :priority, Ecto.Enum, values: [:low, :medium, :high]
    field :status, Ecto.Enum, values: [:todo, :inprogress, :done]

    belongs_to :project, Api.Projects.Project
    has_many :tasks, Api.Tasks.Task

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(epic, attrs) do
    epic
    |> cast(attrs, [:title, :project_id, :description, :priority, :status])
    |> validate_required([:title, :project_id, :priority, :status])
  end
end
