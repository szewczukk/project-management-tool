defmodule ApiWeb.ProjectJSON do
  alias Api.Projects.Project

  @doc """
  Renders a list of projects.
  """
  def index(%{projects: projects}) do
    %{data: for(project <- projects, do: data(project))}
  end

  @doc """
  Renders a single project.
  """
  def show(%{project: project}) do
    %{data: data_with_epics(project)}
  end

  defp data(%Project{} = project) do
    %{
      id: project.id,
      title: project.title,
      description: project.description
    }
  end

  defp data_with_epics(%Project{} = project) do
    %{
      id: project.id,
      title: project.title,
      description: project.description,
      epics: for(epic <- project.epics, do: ApiWeb.EpicJSON.data(epic))
    }
  end
end
