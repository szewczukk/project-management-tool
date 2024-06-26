defmodule Api.Epics.Epic do
  use Ecto.Schema
  import Ecto.Changeset

  schema "epics" do
    field :title, :string
    field :project, :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(epic, attrs) do
    epic
    |> cast(attrs, [:title, :project])
    |> validate_required([:title, :project])
  end
end
