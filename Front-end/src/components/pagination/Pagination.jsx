
import style from './pagination.module.css';

const Pagination = ({ dogsPerPage, totalDogs, currentPage, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDogs / dogsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={style.pagination}>
      {pageNumbers.map(number => (
        <button 
          key={`page-${number}`}
          className={number === currentPage ? style.active : ''}
          onClick={() => onPageChange(number)} 
        >
          {number}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;
