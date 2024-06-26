defmodule Api.EpicsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Api.Epics` context.
  """

  @doc """
  Generate a epic.
  """
  def epic_fixture(attrs \\ %{}) do
    {:ok, epic} =
      attrs
      |> Enum.into(%{
        title: "some title"
      })
      |> Api.Epics.create_epic()

    epic
  end
end
