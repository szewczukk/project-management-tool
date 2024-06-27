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
      status: task.status
    }
  end
end
