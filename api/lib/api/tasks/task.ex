defmodule Api.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :title, :string
    field :description, :string
    field :status, Ecto.Enum, values: [:todo, :inprogress, :done]
    field :priority, Ecto.Enum, values: [:low, :medium, :high]
    field :started_at, :date
    field :completed_at, :date

    belongs_to :project, Api.Projects.Project
    belongs_to :epic, Api.Epics.Epic
    belongs_to :assignee, Api.Accounts.Account

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [
      :title,
      :description,
      :status,
      :priority,
      :started_at,
      :completed_at,
      :project_id,
      :assignee_id,
      :epic_id
    ])
    |> validate_required([:title, :description, :status, :priority, :project_id])
    |> foreign_key_constraint(:assignee_id)
  end
end
