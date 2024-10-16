import './App.css';
import './index.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Add from './pages/Add';
import Update from './pages/Update';
import Delete from './pages/delete';
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/add' element={<Add/>}></Route>
        <Route path='/update/:id' element={<Update/>}></Route>
        <Route path='/delete/:id' element={<Delete/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
