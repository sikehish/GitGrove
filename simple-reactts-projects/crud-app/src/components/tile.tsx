import { useNavigate } from "react-router-dom";


const Tile = (props: any) => {
  const navigate=useNavigate()
  return (
    <div className="bg-white rounded-md p-4 shadow-md mb-4 flex items-center justify-between">
      <h5 className="text-lg font-semibold">{props.title}</h5>
      <div className="flex space-x-2">
        <button className="text-blue-500 hover:text-blue-700" onClick={()=>{navigate(`/update/${props.id}`)}}>Edit</button>
        <button className="text-red-500 hover:text-red-700" onClick={()=>{navigate(`/delete/${props.id}`)}}>Delete</button>
      </div>
    </div>
  );
};

export default Tile;

