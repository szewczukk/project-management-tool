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

  defp data(%Epic{} = epic) do
    %{
      id: epic.id,
      title: epic.title
    }
  end
end
