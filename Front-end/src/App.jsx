//App.jsx

/* style */
import './App.css';

/* components to render */

import FormPage from './components/formpage/FormPage'

import LandingPage from './components/landingpage/LandingPage'
import Detail from './components/detail/Detail'
import HomePage from './components/homepage/HomePage'

/* hooks */

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";




const App = ()=> {
 const {pathname} = useLocation();
  const navigate = useNavigate();
  
  

  const handleEnter = () => {
    navigate('/home');
  };


  return (
    <div className="App">

       <Routes>
       <Route path = '/' element={<LandingPage onEnter={handleEnter} /> }/>
       <Route path='/home' element={<HomePage /> }/>
        <Route path='formpage' element={<FormPage/>}/>
        <Route path='/detail/:name' element={<Detail/>}/>
       
       </Routes>
    </div>
  );
}

export default App;
