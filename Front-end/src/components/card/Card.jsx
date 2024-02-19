import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import style from './card.module.css';

const Card = memo(({ id, name, image, weight, temperament, onClose }) => {
  let imageUrl;
  if (typeof image === 'string') {
     imageUrl = image;
  } else if (typeof image === 'object' && image.url) {
     imageUrl = image.url;
  }

  let weightText;
  if (typeof weight === 'string') {
     weightText = `${weight}`;
  } else if (typeof weight === 'object' && weight.metric) {
    weightText = `${weight.metric} kg`;
  }
  
  return (
    <div className={style['card-inner-container']}>
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
