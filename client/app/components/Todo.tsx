import React, { useState } from "react";
import { TodoType } from "../types";
import useSWR from "swr";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "@/constants/url";

type TodoProps = {
  // id: number;
  todo: TodoType;
};

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  /* 以下が無いとhandleEditを実行したら既存のタイトルが消えてしまうため　*/
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);
  const [editedTime, setEditedTime] = useState<string>(todo.time);
  /* 以下のコードを追加したことにより、Todoをfeach、キャッシュした状態でfeachできるカスタムフックスを作成 */
  const { todos, isLoading, error, mutate } = useTodos();

  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editedTitle, time: editedTime }),
      });

      /**以下のコードが無いとクライアント側でリアルタイムで更新されない。
       * 以下がなくてもサーバー側のデータは更新されるが、クライアント側のデータは更新されない。
       * リアルタイムで更新したい場合はmutateを使う。
       */
      if (response.ok) {
        const editedTodo = await response.json();
        const updatedTodos = todos.map((todo: TodoType) =>
          todo.id === editedTodo.id ? editedTodo : todo
        );
        // mutateでリアルタイムでクライアント側のデータを更新
        mutate(updatedTodos);
      }
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`${API_URL}/deleteTodo/${todo.id}`, {
      method: "DELETE",
      /** headerはdeleteの際はなくてもおｋ */
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    /**以下のコードが無いとクライアント側でリアルタイムで更新されない。
     * 以下がなくてもサーバー側のデータは更新されるが、クライアント側のデータは更新されない。
     * リアルタイムで更新したい場合はmutateを使う。
     */
    if (response.ok) {
      const deletedTodo = await response.json();
      // updatedTodosで削除したtodoを除外する（これがないとコンソールエラーで「id重複してるよ！」というエラーがでる）
      const updatedTodos = todos.filter((todo: TodoType) => todo.id !== id);
      // mutateでリアルタイムでクライアント側のデータを更新
      mutate(updatedTodos);
    }
  };

  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isCompleted: !isCompleted }),
    });

    /**以下のコードが無いとクライアント側でリアルタイムで更新されない。
     * 以下がなくてもサーバー側のデータは更新されるが、クライアント側のデータは更新されない。
     * リアルタイムで更新したい場合はmutateを使う。
     */
    if (response.ok) {
      const editedTodo = await response.json();
      const updatedTodos = todos.map((todo: TodoType) =>
        todo.id === editedTodo.id ? editedTodo : todo
      );
      // mutateでリアルタイムでクライアント側のデータを更新
      mutate(updatedTodos);
    }
  };

  return (
    <div>
      <li className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="todo1"
              name="todo1"
              type="checkbox"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500
                    border-gray-300 rounded"
              onChange={() => toggleTodoCompletion(todo.id, todo.isCompleted)}
            />
            <label className="ml-3 block text-gray-900">
              {isEditing ? (
                <input
                  type="time"
                  className="border rounded py-1 px-2 ml-2"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                />
              ) : (
                <span
                  className={`text-lg font-medium ml-10 mr-2 ${
                    todo.isCompleted ? "line-through" : ""
                  }`}
                >
                  {todo.time}
                </span>
              )}
              {isEditing ? (
                <input
                  type="text"
                  className="border rounded py-1 px-2"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <span
                  className={`text-lg font-medium ml-10 mr-2 ${
                    todo.isCompleted ? "line-through" : ""
                  }`}
                >
                  {todo.title}
                </span>
              )}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
            >
              {isEditing ? "Save" : "✒"}
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Todo;
