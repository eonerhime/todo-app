import { useState } from "react";
import { MdAdd , MdOutlineDelete, MdOutlineModeEditOutline } from "react-icons/md";
import TodoItem from "./TodoItem";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TodoForm from "./TodoForm";

export default function TodoList() {
    const [showForm, setShowForm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const {
        storedValue: todos,
        setValue: _setTodos, // not used in TodoList
        getValue: getTodoList,
        deleteValue: deleteTodo,
    } = useLocalStorage("todoList", []);

    // todoItems always mirrors localStorage
    const [todoItems, setTodoItems] = useState(todos);
    const [showModal, setShowModal] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);

    // Show Todo Details when an item is selected
    if (selectedId !== null) {
        return (
        <TodoItem
            id={selectedId}
            onBack={() => {
            setSelectedId(null);
            setTodoItems(getTodoList()); // reload latest from localStorage
            }}
        />
        );
    }
    
    // Show Todo Form
    if (showForm) {
        return <TodoForm onBack={handleBack} addtodo={addTodo} selecteditem={selectedItem}/>;
    }

    // If there are no todos
    if (todoItems.length === 0) {
        return (
        <div className="ml-8">
            <p className="text-gray-600 mb-4">
            No todo set. Click the button to add a todo.
            </p>

            <AddTodoBtn onClick={addTodo} />

        </div>
        );
    }

    // Refresh the todo list from localStorage after adding/updating
    function addTodo() {
        setShowForm(true); // show form
        setTodoItems(getTodoList()); // refresh list from localStorage
        setSelectedItem(null);   
    }
    
    // Handle editing of a todo item
    function handleBack() {
        setShowForm(false);
        setSelectedItem(null);     
        setTodoItems(getTodoList()); // refresh list from localStorage
    }

    // Handle delete request
    function handleDelete(id, description) {
        setTodoToDelete({ id, description });
        setShowModal(true);     
    }

    // Handle cancle delete
    function handleCancel() {
        setShowModal(false);
        setTodoToDelete(null);
    }

    // Confirm delete
    function handleConfirmDelete(id) {
        deleteTodo(id);
        setTodoItems(getTodoList());
        setShowModal(false);
        setTodoToDelete(null);
    }

    // Show delete confirmation modal
    if (showModal && todoToDelete) {
        return (
        <DeleteModal id={todoToDelete.id} description={todoToDelete.description} onConfirm={handleConfirmDelete} onCancel={handleCancel} />
        );
    }

    // Display list of todos
    return (
        <div className="m-8 max-w-fit">
          <h1 className="font-bold uppercase text-lg mb-4">My Todo List</h1>

            {/* Header */}
            <div className="grid grid-cols-[40px_minmax(200px,900px)_120px] items-center gap-4 font-bold border-b pb-2 mb-2">
                <div>Item#</div>
                <div>Description</div>
                <div className="text-center">Status</div>
            </div>

            {/* Items */}
            {todoItems.map((todo) => (
                <div
                key={todo.id}
                className="grid grid-cols-[40px_minmax(200px,900px)_120px] items-center gap-4 py-2 border-b hover:bg-gray-100"
                >
                {/* ID */}
                <div>{todo.id}.</div>

                {/* Description */}
                <div
                    onClick={() => setSelectedId(todo.id)}
                    className="cursor-pointer"
                >
                    {todo.description}
                </div>

                <div className="flex items-center justify-between w-full">
                    {/* Status */}
                    <p className="text-sm">{todo.status}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <MdOutlineModeEditOutline
                            onClick={() => {
                            setShowForm(true);
                            setSelectedItem(todo);
                            }}
                            size={20}
                            className="text-green-600 cursor-pointer"
                        />
                        <MdOutlineDelete
                            onClick={() => handleDelete(todo.id, todo.description)}
                            size={20}
                            className="text-red-600 cursor-pointer"
                        />
                    </div>
                </div>
                </div>
            ))}

            <AddTodoBtn onClick={() => setShowForm(true)} selecteditem={null}/>
        </div>
    );
}

// Add Todo Button Component
function AddTodoBtn({ onClick, selecteditem }) {
  return (
    <button
      onClick={onClick}
      selecteditem = {selecteditem}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-110"
    >
      <MdAdd size={20} className="inline-block mr-2" />
      Add Todo
    </button>
  );
}

// Delete confirmation modal
function DeleteModal({ id, description, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"> 
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete the todo:</p>
            <p className="italic mb-4">"{description}" (ID: {id})</p>
            <div className="flex justify-end gap-4">
                <button
                onClick={onCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                Cancel
                </button>   
                <button
                onClick={() => onConfirm(id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"    
                >
                Delete
                </button>   
            </div>
        </div>
    </div>
  );
}