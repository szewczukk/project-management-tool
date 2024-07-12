defmodule ApiWeb.EpicController do
  use ApiWeb, :controller

  alias Api.Epics
  alias Api.Epics.Epic

  action_fallback ApiWeb.FallbackController

  plug ApiWeb.Auth.GuardianPipeline when action in [:create]

  def index(conn, %{"project_id" => project_id}) do
    epics = Epics.list_epics_by_project(project_id)
    render(conn, :index, epics: epics)
  end

  def create(conn, %{"epic" => epic_params, "project_id" => project_id}) do
    if Guardian.Plug.authenticated?(conn) do
      account = Guardian.Plug.current_resource(conn)

      epic_params = Map.put(epic_params, "project_id", project_id)
      epic_params = Map.put(epic_params, "owner_id", account.id)

      with {:ok, %Epic{} = epic} <- Epics.create_epic(epic_params) do
        conn
        |> put_status(:created)
        |> put_resp_header("location", ~p"/api/epics/#{epic}")
        |> render(:show, epic: epic)
      end
    end
  end

  def show(conn, %{"id" => id}) do
    epic = Epics.get_epic!(id)
    render(conn, :show, epic: epic)
  end

  def update(conn, %{"id" => id, "epic" => epic_params}) do
    epic = Epics.get_epic!(id)

    with {:ok, %Epic{} = epic} <- Epics.update_epic(epic, epic_params) do
      render(conn, :show, epic: epic)
    end
  end

  def delete(conn, %{"id" => id}) do
    epic = Epics.get_epic!(id)

    with {:ok, %Epic{}} <- Epics.delete_epic(epic) do
      send_resp(conn, :no_content, "")
    end
  end
end
