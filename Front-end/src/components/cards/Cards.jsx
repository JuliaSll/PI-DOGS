import React from 'react';
import Card from '../card/Card';
import style from './cards.module.css';

const Cards = ({ dogs, onClose }) => {
  return (
    <div>
      {dogs.map(({ id, name, image, Temperaments, temperaments, weight }) => {
        const temperamentData = Temperaments || temperaments;
        const temperament = Array.isArray(temperamentData)
          ? temperamentData.map(temp => ({ name: temp.name }))
          : typeof temperamentData === 'string'
          ? temperamentData.split(',').map(t => ({ name: t.trim() }))
          : [];

        return (
          <div key={id} className={style['card-container']}>
            <Card
              key={id}
              name={name}
              image={image}
              weight={weight?.metric}
              temperament={temperament}
              onClose={() => onClose(id)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Cards;