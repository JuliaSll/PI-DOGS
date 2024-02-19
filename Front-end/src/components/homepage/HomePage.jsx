import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
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
import Nav from '../nav/Nav';

const HomePage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allDogs, setAllDogs] = useState([]);
  const [temperaments, setTemperaments] = useState([]);
  const [paginatedCards, setPaginatedCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const orderName = useSelector((state) => state.orderName);
  const orderWeight = useSelector((state) => state.orderWeight);
  const selectedOrigin = useSelector((state) => state.selectedOrigin);
  const selectedTemperament = useSelector((state) => state.selectedTemperament);
  const [searchMessage, setSearchMessage] = useState('');

  const dogsPerPage = 8;

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/dogs');
      const data = response.data;

      const allTemperaments = data
        .filter((dog) => dog.temperament !== undefined)
        .flatMap((dog) => {
          if (typeof dog.temperament === 'string') {
            return dog.temperament.split(',').map((t) => t.trim());
          }
          return dog.temperament.map((t) => t.trim());
        })
        .filter(
          (temperament) =>
            typeof temperament === 'string' && temperament.trim() !== ''
        );

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
    dispatch(setOrderWeight(''));
    dispatch(setOrderName(''));
    dispatch(setOriginFilter(''));
    dispatch(setTemperamentFilter(''));
  }, [dispatch]);

  useEffect(() => {
    setTotalPages(Math.ceil(displayedCards.length / dogsPerPage));
  }, [displayedCards, dogsPerPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * dogsPerPage;
    const endIndex = startIndex + dogsPerPage;

    let filteredAndOrderedResults = [...allDogs];

    if (orderName !== '' && lastAction === 'orderName') {
      filteredAndOrderedResults.sort((a, b) => {
        const nameComparison =
          orderName === 'Ascendente'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);

        return nameComparison !== 0 ? nameComparison : 0;
      });
    }

    if (orderWeight !== '' && lastAction === 'orderWeight') {
      filteredAndOrderedResults.sort((a, b) => {
        const weightA = a.weight ? extractNumericWeight(a.weight) : 0;
        const weightB = b.weight ? extractNumericWeight(b.weight) : 0;

        return orderWeight === 'Ascendente'
          ? weightA - weightB
          : weightB - weightA;
      });
    }

    if (selectedOrigin !== '' && lastAction === 'filterOrigin') {
      filteredAndOrderedResults = filteredAndOrderedResults.filter((dog) => {
        return (
          (selectedOrigin === 'API' && typeof dog.id === 'number') ||
          (selectedOrigin === 'Base de Datos' &&
            typeof dog.id === 'string' &&
            dog.id.startsWith('db')) ||
          (selectedOrigin !== 'API' && selectedOrigin !== 'Base de Datos')
        );
      });
    }

    if (selectedTemperament !== '' && lastAction === 'filterTemperament') {
      filteredAndOrderedResults = filteredAndOrderedResults.filter((dog) => {
        let dogTemperament = [];

        if (dog.temperament) {
          dogTemperament = dog.temperament
            .split(',')
            .map((t) => t.trim().toLowerCase());
        } else if (dog.Temperaments) {
          dogTemperament = dog.Temperaments.map((temp) =>
            temp.name.trim().toLowerCase()
          );
        }

        if (Array.isArray(dogTemperament) && selectedTemperament) {
          return dogTemperament.includes(selectedTemperament.toLowerCase());
        } else if (typeof dogTemperament === 'string' && selectedTemperament) {
          return (
            dogTemperament.toLowerCase() ===
            selectedTemperament.toLowerCase()
          );
        } else {
          return true;
        }
      });
    }

    const paginatedResults = filteredAndOrderedResults.slice(
      startIndex,
      endIndex
    );
    setPaginatedCards(paginatedResults);
    setDisplayedCards(filteredAndOrderedResults);
    setTotalPages(Math.ceil(filteredAndOrderedResults.length / dogsPerPage));
  }, [
    currentPage,
    dogsPerPage,
    orderName,
    orderWeight,
    selectedOrigin,
    selectedTemperament,
    allDogs,
    lastAction,
  ]);

  const handleOrderName = (event) => {
    const { value } = event.target;
    dispatch(setOrderName(value));
    setLastAction('orderName');
  };

  const handleOrderWeight = (event) => {
    const { value } = event.target;
    dispatch(setOrderWeight(value));
    setLastAction('orderWeight');
  };

  const handleFilterTemperament = (event) => {
    const { value } = event.target;
    dispatch(setTemperamentFilter(value));
    setLastAction('filterTemperament');
  };

  const handleFilterOrigin = (event) => {
    const { value } = event.target;
    dispatch(setOriginFilter(value));
    setLastAction('filterOrigin');
  };

  const loadSearchResults = (query = '') => {
    const trimmedQuery = query.trim();
    const isNumericQuery = /^\d+$/.test(trimmedQuery);

    if (trimmedQuery === '') {
      setSearchMessage('');
      setDisplayedCards(allDogs);
      setTotalPages(Math.ceil(allDogs.length / dogsPerPage));
      const startIndex = (currentPage - 1) * dogsPerPage;
      const endIndex = startIndex + dogsPerPage;
      setPaginatedCards(allDogs.slice(startIndex, endIndex));
    } else {
      const filtered = allDogs.filter((dog) => {
        const lowerCaseName = dog.name.toLowerCase();
        const lowerCaseId = dog.id.toString().toLowerCase();

        return (
          lowerCaseName.includes(trimmedQuery.toLowerCase()) ||
          (isNumericQuery && lowerCaseId === trimmedQuery.toLowerCase()) ||
          (!isNumericQuery &&
            lowerCaseId.startsWith(trimmedQuery.toLowerCase()))
        );
      });

      if (filtered.length === 0) {
        setSearchMessage(
          `No hay razas de perros con ${
            isNumericQuery ? 'este ID' : 'este nombre'
          }`
        );
        setDisplayedCards(allDogs);
        setTotalPages(Math.ceil(allDogs.length / dogsPerPage));
        setPaginatedCards(allDogs.slice(0, dogsPerPage));
      } else {
        setSearchMessage('');
        setDisplayedCards(filtered);
        const startIndex = (currentPage - 1) * dogsPerPage;
        const endIndex = startIndex + dogsPerPage;
        const paginatedResults = filtered.slice(startIndex, endIndex);
        setPaginatedCards(paginatedResults);
        setTotalPages(Math.ceil(filtered.length / dogsPerPage));
      }
    }

    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    const validPage = Math.min(Math.max(pageNumber, 1), totalPages);
    setCurrentPage(validPage);
  };

  const onClose = (id) => {
    const updatedDogs = allDogs.filter((dog) => dog.id !== id);
    setAllDogs(updatedDogs);
  
    
    const newTotalPages = Math.ceil(updatedDogs.length / dogsPerPage);
  
  
    const newCurrentPage = Math.min(currentPage, newTotalPages);
  
    setCurrentPage(newCurrentPage);
    setTotalPages(newTotalPages);
  };
  

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
          {searchMessage && (
            <p className={style['search-message']}>{searchMessage}</p>
          )}
        </div>
      </div>

      <div className={style['cards-container']}>
        {paginatedCards.map(
          ({ id, name, image, Temperaments, temperaments, weight, temperament }) => {
            const temperamentData = Temperaments || temperaments || temperament;
            const mappedTemperament = Array.isArray(temperamentData)
              ? temperamentData.map((temp) => ({ name: temp.name }))
              : typeof temperamentData === 'string'
              ? temperamentData.split(',').map((t) => ({ name: t.trim() }))
              : [];

            return (
              <div key={id} className={style['homepage-card-container']}>

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
          }
        )}
      </div>
    </div>
  );
};

export default HomePage;