import { useNavigate, useParams } from "react-router-dom";
function deleteTask(id:any):void{
    console.log(id);
    localStorage.removeItem(id);
    //console.log(task);
}
const Delete=()=>{
    //let [task,setTask]=useState('');
    const navigate=useNavigate();
    const {id}=useParams();
    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h3 className="p-6">Are you sure?</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
              type="button"
              onClick={() => {
                deleteTask(id);
                navigate('/');
              }}
            >
              Confirm Delete 
            </button>
          </div>
        </div>
      );
}
export default Delete;