defmodule ApiWeb.TaskJSON do
  alias Api.Tasks.Task

  @doc """
  Renders a list of tasks.
  """
  def index(%{tasks: tasks}) do
    %{data: for(task <- tasks, do: data(task))}
  end

  @doc """
  Renders a single task.
  """
  def show(%{task: task}) do
    %{data: data(task)}
  end

  def data(%Task{} = task) do
    %{
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      started_at: format_date(task.started_at),
      completed_at: format_date(task.completed_at),
      epicId: task.epic_id,
      assignee: load_assignee(task.assignee)
    }
  end

  defp format_date(nil), do: nil

  defp format_date(date) do
    IO.inspect(date)

    date
  end

  defp load_assignee(nil), do: nil
  defp load_assignee(%Ecto.Association.NotLoaded{}), do: nil
  defp load_assignee(assignee), do: ApiWeb.AccountJSON.data(assignee)
end
