/* style */
import './App.css';

/* components to render */
import FormPage from './components/formpage/FormPage'
import LandingPage from './components/landingpage/LandingPage'
import Detail from './components/detail/Detail'
import HomePage from './components/homepage/HomePage'

/* hooks */
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';


const App = ()=> {
  const navigate = useNavigate();
  const [temperaments, setTemperaments] = useState([]);
 
  useEffect(() => {
    const fetchTemperaments = async () => {
      try {
        const response = await fetch('http://localhost:3001/temperaments');
        const data = await response.json();

     
        const uniqueTemperaments = [...new Set(data)];
        setTemperaments(uniqueTemperaments);
      } catch (error) {
        console.error('Error al obtener temperamentos', error);
      }
    };

    fetchTemperaments();
  }, []);


  const handleEnter = () => {
    navigate('home');
  };


  return (
    <div className="App">
      <Routes>
        <Route path = '/' element={<LandingPage onEnter={handleEnter} /> }/>
        <Route path='/home' element={<HomePage /> }/>
        <Route path='formpage' element={<FormPage temperaments={temperaments}/>}/>
        <Route path='/detail/:name' element={<Detail/>}/>
      </Routes>
    </div>
  );
}

export default App;
