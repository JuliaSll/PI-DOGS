// Detail.jsx
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import style from './detail.module.css';

const Detail = () => {
  const params = useParams();
  const [dog, setDog] = useState({});

  useEffect(() => {
    axios(`http://localhost:3001/dogs/name?name=${encodeURIComponent(params?.name)}`)
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          const firstDog = data[0];
          setDog(adaptData(firstDog));
        } else if (data && typeof data === 'object') {
          setDog(adaptData(data));
        } else {
          console.log('No hay perro con ese nombre');
        }
      })
      .catch(() => {
        console.log('Se produjo un error al obtener los datos del perro');
      });
  }, [params?.name]);

  const adaptData = (data) => {
    const adaptedDog = { ...data };

    if (data.height && data.height.metric) {
      adaptedDog.height = data.height.metric;
    }

    if (data.weight && data.weight.metric) {
      adaptedDog.weight = data.weight.metric;
    }

    if (data.temperament) {
      adaptedDog.temperament = data.temperament;
    } else if (data.Temperaments && Array.isArray(data.Temperaments)) {
      adaptedDog.temperament = data.Temperaments.map((temp) => temp.name).join(', ');
    }

    if (data.lifeSpan) {
      adaptedDog.life_span = data.lifeSpan;
    } else if (data.life_span) {
      adaptedDog.life_span = data.life_span;
    }

    return adaptedDog;
  };

  return (
    <div className={style['detail-container']}>
      <h2>ID: {dog?.id}</h2>
      <p className={style['detail-text']}>Nombre: {dog?.name}</p>
      {dog?.height && (
        <p className={style['detail-text']}>Altura: {dog.height}</p>
      )}
      {dog?.weight && (
        <p className={style['detail-text']}>Peso: {dog.weight}</p>
      )}
      {dog?.temperament && (
        <p className={style['detail-text']}>Temperamentos: {dog.temperament}</p>
      )}
      {dog?.life_span && (
        <p className={style['detail-text']}>Años de vida: {dog.life_span}</p>
      )}
      {dog?.image && (
        <img src={typeof dog.image === 'object' ? dog.image.url : dog.image} alt={dog.name} className={style['detail-image']} />
      )}
    </div>
  );
};

export default Detail;
