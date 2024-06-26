defmodule Api.EpicsTest do
  use Api.DataCase

  alias Api.Epics

  describe "epics" do
    alias Api.Epics.Epic

    import Api.EpicsFixtures

    @invalid_attrs %{title: nil}

    test "list_epics/0 returns all epics" do
      epic = epic_fixture()
      assert Epics.list_epics() == [epic]
    end

    test "get_epic!/1 returns the epic with given id" do
      epic = epic_fixture()
      assert Epics.get_epic!(epic.id) == epic
    end

    test "create_epic/1 with valid data creates a epic" do
      valid_attrs = %{title: "some title"}

      assert {:ok, %Epic{} = epic} = Epics.create_epic(valid_attrs)
      assert epic.title == "some title"
    end

    test "create_epic/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Epics.create_epic(@invalid_attrs)
    end

    test "update_epic/2 with valid data updates the epic" do
      epic = epic_fixture()
      update_attrs = %{title: "some updated title"}

      assert {:ok, %Epic{} = epic} = Epics.update_epic(epic, update_attrs)
      assert epic.title == "some updated title"
    end

    test "update_epic/2 with invalid data returns error changeset" do
      epic = epic_fixture()
      assert {:error, %Ecto.Changeset{}} = Epics.update_epic(epic, @invalid_attrs)
      assert epic == Epics.get_epic!(epic.id)
    end

    test "delete_epic/1 deletes the epic" do
      epic = epic_fixture()
      assert {:ok, %Epic{}} = Epics.delete_epic(epic)
      assert_raise Ecto.NoResultsError, fn -> Epics.get_epic!(epic.id) end
    end

    test "change_epic/1 returns a epic changeset" do
      epic = epic_fixture()
      assert %Ecto.Changeset{} = Epics.change_epic(epic)
    end
  end
end
