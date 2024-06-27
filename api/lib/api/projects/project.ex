defmodule Api.Projects.Project do
  use Ecto.Schema
  import Ecto.Changeset

  schema "projects" do
    field :title, :string
    field :description, :string
    has_many :epics, Api.Epics.Epic
    has_many :tasks, Api.Tasks.Task

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:title, :description])
    |> validate_required([:title, :description])
  end
end
