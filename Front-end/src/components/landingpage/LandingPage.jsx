
import React from 'react';
import { Link } from 'react-router-dom';
import style from './Landingpage.module.css';

const LandingPage = ({ onEnter }) => {
  return (
    <div className={`${style.container} ${style.backgroundImage}`}>
      <h1 className={style.title}>Bienvenido al Proyecto Dogs</h1>
      <Link to="/home">
        <button className={style.button} onClick={onEnter}>
          Ingresar
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;
