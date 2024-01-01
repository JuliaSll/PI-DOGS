import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch ,useSelector} from 'react-redux';
import {
  setOrderName,
  setOrderWeight,
  setTemperamentFilter,
  setOriginFilter,
} from '../../redux/actions';
import { extractNumericWeight } from '../../redux/reducer';
import Select from '../select/Select';
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';
import SearchBar from '../seacrhbar/SearchBar';
import style from './homepage.module.css';
import Nav from '../nav/Nav'

const HomePage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allDogs, setAllDogs] = useState([]);
  const [temperaments, setTemperaments] = useState([]);

  const [paginatedCards, setPaginatedCards] = useState([]);
 
  const [displayedCards, setDisplayedCards] = useState([]);

  const orderName = useSelector((state) => state.orderName);
  const orderWeight = useSelector((state) => state.orderWeight);
  const selectedOrigin = useSelector((state) => state.selectedOrigin);
  const selectedTemperament = useSelector((state) => state.selectedTemperament)


  const dogsPerPage = 8;
  
  
  const fetchData = async () => {
    
      try {
        const response = await axios.get('http://localhost:3001/dogs');
        const data = response.data;
       
        const allTemperaments = data
          .filter(dog => dog.temperament !== undefined) // Filtra aquellos con temperamento definido
          .flatMap(dog => {
            if (typeof dog.temperament === 'string') {
              return dog.temperament.split(',').map(t => t.trim());
            }
            return dog.temperament.map(t => t.trim());
          })
          .filter(temperament => typeof temperament === 'string' && temperament.trim() !== '');
    
        const uniqueTemperaments = Array.from(new Set(allTemperaments));
    
        setTemperaments(uniqueTemperaments);
        setAllDogs(data);
        dispatch(setTemperamentFilter(''));
        dispatch(setOriginFilter(''));
      } catch (error) {
        console.error('Error al cargar los datos iniciales:', error);
      }
    };
  

  useEffect(() => {
    fetchData();
    dispatch(setOrderWeight('')); // Establecer en cadena vacía al cargar
    dispatch(setOrderName(''));   // Establecer en cadena vacía al cargar
    dispatch(setOriginFilter(''));
    dispatch(setTemperamentFilter(''))
  }, [dispatch]);

  useEffect(() => {
    setTotalPages(Math.ceil(displayedCards.length / dogsPerPage));
  }, [displayedCards]);

  useEffect(() => {
   
    const startIndex = (currentPage - 1) * dogsPerPage;
    const endIndex = startIndex + dogsPerPage;
  
    let filteredAndOrderedResults = [...displayedCards]; // Clonamos el array original
  
    // Ordenar por nombre (ascendente o descendente)
    if (orderName !== "") {
      filteredAndOrderedResults.sort((a, b) => {
        const nameComparison = orderName === "Ascendente"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
  
        return nameComparison !== 0 ? nameComparison : 0;
      });
    }
  
    // Ordenar por peso (ascendente o descendente)
    if (orderWeight !== "") {
      filteredAndOrderedResults.sort((a, b) => {
        const weightA = a.weight ? extractNumericWeight(a.weight) : 0;
        const weightB = b.weight ? extractNumericWeight(b.weight) : 0;
  
        return orderWeight === "Ascendente"
          ? weightA - weightB
          : weightB - weightA;
      });
    }
    if (selectedOrigin !== '') {
      filteredAndOrderedResults = filteredAndOrderedResults.filter((dog) => {
        return (
          (selectedOrigin === 'API' && typeof dog.id === 'number') ||
          (selectedOrigin === 'Base de Datos' && typeof dog.id === 'string' && dog.id.startsWith('db')) ||
          (selectedOrigin !== 'API' && selectedOrigin !== 'Base de Datos')
        );
      });
    }
   
   
    if (selectedTemperament !== '') {
      // Filtrar por temperamento solo si se selecciona un temperamento
      filteredAndOrderedResults = filteredAndOrderedResults.filter((dog) => {
        let dogTemperament = [];
    
        // Manejar diferentes estructuras de temperamento
        if (dog.temperament) {
          // Para API
          dogTemperament = dog.temperament.split(',').map((t) => t.trim().toLowerCase());
        } else if (dog.Temperaments) {
          // Para Base de Datos
          dogTemperament = dog.Temperaments.map((temp) => temp.name.trim().toLowerCase());
        }
    
      
    
        if (Array.isArray(dogTemperament) && selectedTemperament) {
          return dogTemperament.includes(selectedTemperament.toLowerCase());
        } else if (typeof dogTemperament === 'string' && selectedTemperament) {
          // Manejar el caso de cadena simple para datos de la API
          return dogTemperament.toLowerCase() === selectedTemperament.toLowerCase();
        } else {
          // Si no hay temperamento definido, incluir el perro
          return true;
        }
      });
    }
    
    const paginatedResults = filteredAndOrderedResults.slice(startIndex, endIndex);
    setPaginatedCards(paginatedResults);

  }, [currentPage, dogsPerPage, orderName, orderWeight, selectedOrigin, selectedTemperament, displayedCards]);

    const handleOrderName = (event) => {
      const { value } = event.target;
      dispatch(setOrderName(value));
    };

    const handleOrderWeight = (event) => {
      const { value } = event.target;
      dispatch(setOrderWeight(value));
    };

    const handleFilterTemperament = (event) => {
      const { value } = event.target;
      
      dispatch(setTemperamentFilter(value));
    };
    
    const handleFilterOrigin = (event) => {
      const { value } = event.target;
      dispatch(setOriginFilter(value))
    };


    const loadSearchResults = (query = '') => {
      const trimmedQuery = query.trim();
    
      // Verificar si la consulta es un número
      const isNumericQuery = /^\d+$/.test(trimmedQuery);
    
      const filtered = allDogs.filter((dog) => {
        const lowerCaseName = dog.name.toLowerCase();
        const lowerCaseId = dog.id.toString().toLowerCase();
    
        // Buscar por nombre, ID numérico o ID de la base de datos
        return (
          lowerCaseName.includes(trimmedQuery.toLowerCase()) ||
          (isNumericQuery && lowerCaseId === trimmedQuery) ||
          (!isNumericQuery && lowerCaseId.includes(trimmedQuery.toLowerCase()))
        );
      });
    
      setDisplayedCards(filtered);
      setCurrentPage(1);
    };
    
    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    };

    const onClose = (id) => {
      const updatedDogs = allDogs.filter((dog) => dog.id !== id);
    setAllDogs(updatedDogs);
    setCurrentPage(1); // Resetear la página actual al cerrar una tarjeta
    };

  useEffect(() => {
    loadSearchResults();
  }, [allDogs]);

  return (
    <div className={style['homepage-container']}>
      <div className={style['navbar-select-container']}>
        <div className={style['filters-container']}>
          <p>Orden en peso:</p>
          <Select
            name="orderWeight"
            options={['', 'Ascendente', 'Descendiente']}
            handleChange={handleOrderWeight}
          />
          <p>Orden en nombre:</p>
          <Select
            name="orderName"
            options={['', 'Ascendente', 'Descendiente']}
            handleChange={handleOrderName}
          />
          <p>Filtro por temperamento:</p>
          <Select
            name="filterTemperament"
            options={['', ...temperaments]}
            handleChange={handleFilterTemperament}
          />
          <p>Filtro por origen:</p>
          <Select
            name="filterOrigin"
            options={['', 'API', 'Base de Datos']}
            handleChange={handleFilterOrigin}
          />
        </div>
        <Nav />
      </div>
      <div className={style['search-bar-pagination-container']}>
        <div className={style['pagination-container']}>
          {displayedCards.length > 0 && (
            <Pagination
              dogsPerPage={dogsPerPage}
              totalDogs={displayedCards.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <div className={style['search-bar-container']}>
          <SearchBar onSearch={loadSearchResults} />
        </div>
      </div>
  
      <div className={style['cards-container']}>
        {paginatedCards.map(({ id, name, image, Temperaments, temperaments, weight, temperament }) => {
          const temperamentData = Temperaments || temperaments || temperament;
          const mappedTemperament = Array.isArray(temperamentData)
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
                weight={weight}
                temperament={mappedTemperament}
                onClose={() => onClose(id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
      }
  export default HomePage;