import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function updateSubmit(task:any,id:any):void{
    console.log(id);
    localStorage.setItem(id,task);
    console.log(task);
}
const Update=()=>{
    let [task,setTask]=useState('');
    const navigate=useNavigate();
    const {id}=useParams();
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
                updateSubmit(task,id);
                navigate('/');
              }}
            >
              Update Task
            </button>
          </div>
        </div>
      );
}
export default Update;