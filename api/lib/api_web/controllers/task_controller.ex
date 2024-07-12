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

    current_utc_time = DateTime.utc_now()

    task_params =
      task_params
      |> Map.delete("started_at")
      |> Map.delete("completed_at")

    task_params =
      cond do
        Map.get(task_params, "assignee_id") != nil && task.status === :todo ->
          task_params
          |> Map.put("status", :inprogress)
          |> Map.put("started_at", current_utc_time)

        Map.get(task_params, "assignee_id", -1) === nil && task.status === :inprogress ->
          task_params
          |> Map.put("status", "todo")
          |> Map.put("started_at", nil)

        Map.get(task_params, "status") === "done" && task.status !== :done ->
          task_params
          |> Map.put("completed_at", current_utc_time)

        Map.get(task_params, "status") === "todo" ->
          task_params
          |> Map.put("completed_at", nil)
          |> Map.put("started_at", nil)
          |> Map.put("assignee_id", nil)

        true ->
          task_params
      end

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
