defmodule Api.Epics do
  @moduledoc """
  The Epics context.
  """

  import Ecto.Query, warn: false
  alias Api.Repo

  alias Api.Epics.Epic

  @doc """
  Returns the list of epics.

  ## Examples

      iex> list_epics()
      [%Epic{}, ...]

  """
  def list_epics do
    Repo.all(Epic)
  end

  def list_epics_by_project(project_id) do
    Repo.all(from e in Epic, where: e.project_id == ^project_id)
  end

  @doc """
  Gets a single epic.

  Raises `Ecto.NoResultsError` if the Epic does not exist.

  ## Examples

      iex> get_epic!(123)
      %Epic{}

      iex> get_epic!(456)
      ** (Ecto.NoResultsError)

  """
  def get_epic!(id), do: Repo.get!(Epic, id)

  @doc """
  Creates a epic.

  ## Examples

      iex> create_epic(%{field: value})
      {:ok, %Epic{}}

      iex> create_epic(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_epic(attrs \\ %{}) do
    %Epic{}
    |> Epic.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a epic.

  ## Examples

      iex> update_epic(epic, %{field: new_value})
      {:ok, %Epic{}}

      iex> update_epic(epic, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_epic(%Epic{} = epic, attrs) do
    epic
    |> Epic.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a epic.

  ## Examples

      iex> delete_epic(epic)
      {:ok, %Epic{}}

      iex> delete_epic(epic)
      {:error, %Ecto.Changeset{}}

  """
  def delete_epic(%Epic{} = epic) do
    Repo.delete(epic)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking epic changes.

  ## Examples

      iex> change_epic(epic)
      %Ecto.Changeset{data: %Epic{}}

  """
  def change_epic(%Epic{} = epic, attrs \\ %{}) do
    Epic.changeset(epic, attrs)
  end
end
