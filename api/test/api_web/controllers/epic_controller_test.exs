defmodule ApiWeb.EpicControllerTest do
  use ApiWeb.ConnCase

  import Api.EpicsFixtures

  alias Api.Epics.Epic

  @create_attrs %{
    title: "some title"
  }
  @update_attrs %{
    title: "some updated title"
  }
  @invalid_attrs %{title: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all epics", %{conn: conn} do
      conn = get(conn, ~p"/api/epics")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create epic" do
    test "renders epic when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/epics", epic: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/epics/#{id}")

      assert %{
               "id" => ^id,
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/epics", epic: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update epic" do
    setup [:create_epic]

    test "renders epic when data is valid", %{conn: conn, epic: %Epic{id: id} = epic} do
      conn = put(conn, ~p"/api/epics/#{epic}", epic: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/epics/#{id}")

      assert %{
               "id" => ^id,
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, epic: epic} do
      conn = put(conn, ~p"/api/epics/#{epic}", epic: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete epic" do
    setup [:create_epic]

    test "deletes chosen epic", %{conn: conn, epic: epic} do
      conn = delete(conn, ~p"/api/epics/#{epic}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/epics/#{epic}")
      end
    end
  end

  defp create_epic(_) do
    epic = epic_fixture()
    %{epic: epic}
  end
end
