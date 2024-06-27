defmodule ApiWeb.TaskController do
  use ApiWeb, :controller

  alias Api.Tasks
  alias Api.Tasks.Task

  action_fallback ApiWeb.FallbackController

  def index(conn, %{"project_id" => project_id} = params) do
    tasks =
      case Map.get(params, "epic_id") do
        nil -> Tasks.list_tasks_by_epic(project_id)
        id -> Tasks.list_tasks_by_project(id)
      end

    render(conn, :index, tasks: tasks)
  end

  def create(
        conn,
        %{"task" => task_params, "project_id" => project_id} = params
      ) do
    task_params = Map.put(task_params, "project_id", project_id)

    task_params =
      case Map.get(params, "epic_id") do
        nil -> task_params
        id -> Map.put(task_params, "epic_id", id)
      end

    with {:ok, %Task{} = task} <- Tasks.create_task(task_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/tasks/#{task}")
      |> render(:show, task: task)
    end
  end

  def show(conn, %{"id" => id}) do
    task = Tasks.get_task!(id)
    render(conn, :show, task: task)
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    task = Tasks.get_task!(id)

    with {:ok, %Task{} = task} <- Tasks.update_task(task, task_params) do
      render(conn, :show, task: task)
    end
  end

  def delete(conn, %{"id" => id}) do
    task = Tasks.get_task!(id)

    with {:ok, %Task{}} <- Tasks.delete_task(task) do
      send_resp(conn, :no_content, "")
    end
  end
end
