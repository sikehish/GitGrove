import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <h1 className="text-blue text-2xl font-bold">Task Manager</h1>
        <button
          type="button"
          className="text-white px-2 py-1 rounded-md bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 md:ml-4"
          onClick={() => {
            navigate("/add");
          }}
        >
          Add a task
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

