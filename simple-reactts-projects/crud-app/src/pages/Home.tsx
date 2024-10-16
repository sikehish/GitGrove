import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Tile from "../components/tile";

interface tasks {
  key: string;
  title: string;
}

const Home = () => {
  let [tasklist, setTaskList] = useState<Array<tasks>>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);

    // Use the map function to create a new array
    const updatedTaskList = keys.map((key) => {
      const value = localStorage.getItem(key);
      return { key, title: value != null ? value : "" };
    });

    // Update the state with the new array
    setTaskList(updatedTaskList);
  }, []); // Empty dependency array to run the effect only once during component mount

  return (
    <div>
      <div className="p-5">
      <Navbar />
      </div>
      {tasklist.map((a: tasks) => (
        <Tile key={a.key} title={a.title} id={a.key}/>
      ))}
    </div>
  );
};

export default Home;
