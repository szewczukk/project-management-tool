defmodule ApiWeb.EpicJSON do
  alias Api.Epics.Epic

  @doc """
  Renders a list of epics.
  """
  def index(%{epics: epics}) do
    %{data: for(epic <- epics, do: data(epic))}
  end

  @doc """
  Renders a single epic.
  """
  def show(%{epic: epic}) do
    %{data: data(epic)}
  end

  def data(%Epic{} = epic) do
    %{
      id: epic.id,
      title: epic.title,
      tasks: load_tasks(epic.tasks)
    }
  end

  defp load_tasks(%Ecto.Association.NotLoaded{}), do: []
  defp load_tasks(tasks), do: for(task <- tasks || [], do: ApiWeb.TaskJSON.data(task))
end
