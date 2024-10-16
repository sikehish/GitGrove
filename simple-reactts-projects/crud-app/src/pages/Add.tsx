import { useState } from "react";
import { useNavigate } from "react-router-dom";
import uuid from 'react-uuid';
function addSubmit(task:any):void{
    localStorage.setItem(uuid(),task);
    console.log(task);
}
const Add=()=>{
    let [task,setTask]=useState('');
    const navigate=useNavigate();
    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <input
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
              type="text"
              onChange={(event) => setTask(event.target.value)}
              placeholder="Enter your task"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
              type="button"
              onClick={() => {
                addSubmit(task);
                navigate('/');
              }}
            >
              Add Task
            </button>
          </div>
        </div>
      );
}
export default Add;