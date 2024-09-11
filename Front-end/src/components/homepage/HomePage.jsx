import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from "./homepage.module.css";
import Nav from '../nav/Nav';



const HomePage = () => {
  const [availableDogs, setAvailableDogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; 

  useEffect(() => {
    const fetchAvailableDogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dogsAdoption');
        setAvailableDogs(response.data);
      } catch (error) {
        console.error('Error fetching available dogs:', error);
      }
    };

    fetchAvailableDogs();
  }, []);

  const showNextDogs = () => {
    setCurrentIndex((index) => {
      if (index + itemsPerPage >= availableDogs.length) return 0;
      return index + itemsPerPage;
    });
  }

  const showPrevDogs = () => {
    setCurrentIndex((index) => {
      if (index === 0) return Math.max(availableDogs.length - itemsPerPage, 0);
      return index - itemsPerPage;
    });
  }

  return (
    <div className={style.HomePage}>
      <Nav />
     
      
      <section className={style["adoption-section"]}>
        <h2>Perros Disponibles para Adopción</h2>
        
        <div className={style.carousel}>
          <button onClick={showPrevDogs} className={style.prevButton}>
            &lt;
          </button>
          <div className={style.dogContainer} style={{ transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)` }}>
            {availableDogs.map((dog) => (
              <div key={dog.id} className={style.dogItem}>
                <img src={dog.imagen} alt={dog.nombre} className={style.dogImage} />
                <p className={style.dogName}>{dog.nombre}</p>
                <p className={style.dogInfo}>Edad: {dog.edad} años</p>
                <p className={style.dogInfo}>Altura: {dog.altura}</p>
                <p className={style.dogDescripcion}> {dog.descripcion}</p>
              </div>
            ))}
          </div>
          <button onClick={showNextDogs} className={style.nextButton}>
            &gt;
          </button>
        </div>

     
        <section className={style.donationsBanner}>
          <h2>¡Apoya nuestra causa!</h2>
          <p>¿Quieres ayudar a perros necesitados? ¡Haz una donación hoy!</p>
          <button className={style.donationButton}>¡Haz una Donación!</button>
        </section>
        <section className={style.donationsSection}>
          <h3>Cómo Puedes Ayudar</h3>
          <p>Puedes contribuir de diversas maneras:</p>
          <ul>
            <li>Donaciones monetarias a través de PayPal, tarjeta de crédito, o transferencia bancaria.</li>
            <li>Donaciones de comida para perros, juguetes, mantas, y otros suministros.</li>
            <li>Voluntariado en nuestro refugio o en eventos de adopción.</li>
          </ul>
          <p>Toda ayuda es bienvenida y apreciada. ¡Gracias por tu generosidad!</p>
        </section>
      </section>
    </div>
  )
}

export default HomePage;
