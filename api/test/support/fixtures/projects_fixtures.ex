defmodule Api.ProjectsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Api.Projects` context.
  """

  @doc """
  Generate a project.
  """
  def project_fixture(attrs \\ %{}) do
    {:ok, project} =
      attrs
      |> Enum.into(%{
        title: "some title"
      })
      |> Api.Projects.create_project()

    project
  end
end
