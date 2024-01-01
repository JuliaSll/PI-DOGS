// Card.jsx
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import style from './card.module.css';

const Card = memo(({ id, name, image, weight, temperament, onClose }) => {
  let imageUrl;

  // Verificar si la imagen es una cadena de texto o un objeto
  if (typeof image === 'string') {
    // Caso de la base de datos
    imageUrl = image;
  } else if (typeof image === 'object' && image.url) {
    // Caso de la API
    imageUrl = image.url;
  }

  let weightText;

  // Verificar si weight es una cadena de texto o un objeto
  if (typeof weight === 'string') {
    // Caso de la base de datos
    weightText = weight;
  } else if (typeof weight === 'object' && weight.metric) {
    // Caso de la API
    weightText = `${weight.metric}`;
  }

  return (
    <div className={style['card-container']}>
      <Link to={`/detail/${encodeURIComponent(name)}`} className={style['card-title']}>
        <h2>{name}</h2>
      </Link>
  
      <div className={style['card-image-container']}>
        <img
          src={imageUrl}
          alt={name}
          className={style['card-image']}
        />
      </div>
  
      <p className={style['card-text']}>Weight: {weightText}</p>
      <p className={style['card-text']}>Temperament: {temperament.map(temp => temp.name).join(', ')}</p>
  
      <button onClick={() => onClose(id)} className={style['card-button']}>
        X
      </button>
    </div>
  );
});

export default Card;
