import { _useEffect, useState } from "react";
import { MdAdd, MdArrowBack } from "react-icons/md";
import { useLocalStorage } from "../hooks/useLocalStorage";

const TodoForm = ({onBack, addtodo, selecteditem }) => {
  
  const [text, setText] = useState(selecteditem?.description || "");
  const [status, setStatus] = useState(selecteditem?.status || "pending");
  const { 
    storedValue: todos, 
    setValue: setTodo, 
    _getValue, 
    updateValue } = useLocalStorage(
    "todoList", []
  );
  // const [_todoList, setTodoList] = useState(todos);
  const [alertMessage, setAlertMessage] = useState("");
 
  function handleCreateUpdate() {
    if (!selecteditem?.id) {
      
      if (text.trim() === "") {
        setAlertMessage("Todo description cannot be empty.");
        return;
      }
      
      
      const newTodo = {
        id: getNextId(todos),
        description: text,
        status,
      };

      setTodo((prev) => [...prev, newTodo]);
      // setTodoList((prev) => [...prev, newTodo]);
    } else {
      const updatedTodo = {
        ...selecteditem,
        description: text,
        status,
      };

      updateValue(selecteditem.id, updatedTodo);
      // setTodoList(getValue());
    }

    addtodo();
    onBack();

    return;
  }

  return (
    <div className="m-8">
        <label className="block font-bold mb-1" htmlFor="description">
          Todo Details
        </label>

        {/* Show editing label if selecteditem is provided */}
        {selecteditem?.id && <label className="block font-medium mb-2">Editing Todo ID: {selecteditem.id}</label>}

        <textarea
          id="description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo description..."
          rows={4} 
          className="w-[50%] border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />

        <p className="text-gray-500 mt-1">{text.length} characters</p>

        {/* Display status of todo if editing */}
        {selecteditem?.id && (
          <div className="mt-4">
            <label className="block font-bold mb-1" htmlFor="status">
              Status  
            </label>
            <select
              id="status"
              defaultValue={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-2 py-1"
            > 
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div className="flex flex-row gap-4">
          <Button onClick={onBack} icon = {<MdArrowBack size={20} className="inline-block mr-2" />} label="Back to List" />
          <Button onClick={handleCreateUpdate} icon = {<MdAdd size={20} className="inline-block mr-2" />} label= {selecteditem?.id ? "Update Todo Item" : "Create Todo Item"} />
        </div>

        {alertMessage && <div className="mt-4 text-red-600 font-medium">{alertMessage}</div>}
     
    </div>
  )
}

export default TodoForm;

function Button({onClick, label, icon}) {
  return (
     <button
        onClick={onClick}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-110"
        >
        {icon}
        {label}
      </button>
  )
}

// Auto-generate unique IDs for new todo items
function getNextId(list) {
  if (!list.length) return 1;
  return Math.max(...list.map(t => t.id)) + 1;
}