import { useLocalStorage } from "../hooks/useLocalStorage";

export default function TodoItem({ id, onBack }) {
  const { storedValue: todos, setValue: setTodos } = useLocalStorage(
    "todoList",
    []
  );

  // Find the todo item
  const selectedTodo = todos.find((todo) => todo.id === id);

  // If todo does not exist (null, deleted, etc.)
  if (!selectedTodo) {
    return (
      <div className="m-8">
        <h2 className="text-lg font-bold mb-2">Todo Not Found</h2>
        <p className="text-gray-600 mb-4">
          The selected todo item does not exist.
        </p>

        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  // Update status (pending → completed, etc.)
  function handleStatusChange(newStatus) {
    const updatedList = todos.map((todo) =>
      todo.id === id ? { ...todo, status: newStatus } : todo
    );

    setTodos(updatedList); // saves to localStorage + state
  }

  return (
    <div className="m-8">
      <h2 className="text-xl font-bold mb-4">Todo Details</h2>

      <p className="mb-2">
        <strong>ID:</strong> {selectedTodo.id}
      </p>

      <p className="mb-2">
        <strong>Description:</strong> {selectedTodo.description}
      </p>

      <p className="mb-4">
        <strong>Status:</strong>{" "}
        <select
          defaultValue={selectedTodo.status}
          className="border rounded px-2 py-1"
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </p>

      <button
        onClick={onBack}
        className="mt-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
}
