import { useState, useEffect } from "react";
import validation from "./validation";
import { Link } from 'react-router-dom';
import style from './formpage.module.css';

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    height: '',
    weight: '',
    lifeSpan: '',
    temperament: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null); // Nuevo estado para el error de la API
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const validationErrors = validation(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      ...formData,
      lifeSpan: `${formData.lifeSpan} years`,
    };

    try {
      const response = await fetch('http://localhost:3001/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setFormData({
          name: '',
          height: '',
          weight: '',
          lifeSpan: '',
          image: '',
          temperament: '',
        });
        setErrors({});
        setApiError(null);
        setSuccessMessage('¡La raza ha sido creada correctamente!');// Limpiar el error de la API
      } else {
        const responseData = await response.json();
        setApiError(responseData.error || 'Error desconocido'); // Establecer el error de la API
        setSuccessMessage(null); 
      }
    } catch (error) {
      setApiError('Error al conectar con la API'); // Establecer un mensaje de error genérico
    }
  };
  useEffect(() => {
    // Limpia el mensaje de éxito después de un tiempo (por ejemplo, 5 segundos)
    const timeout = setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  const isFormValid = Object.keys(errors).length === 0;
    return(

      <div className={style['form-container']}>
           <Link to="/home">
                <button className={style['form-button']}>Volver a la página principal</button>
              </Link>
            <h1>Form Page</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
            <label htmlFor="name" className={style['form-label']}>
                 Name:
                 </label>
                 <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={style['form-input']}
        />
            {errors.name && <p className={style['error-message']}>{errors.name}</p>}



               

            <label htmlFor="height" className={style['form-label']}>
            Height:
            </label>
        <input
          type="text"
          name="height"
          value={formData.height}
          onChange={handleChange}
          className={style['form-input']}
        />
        {errors.height && <p className={style['error-message']}>{errors.height}</p>}



               


        <label htmlFor="weight" className={style['form-label']}>
          Weight:
        </label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
         className={style['form-input']}
                />
                {errors.weight && <p className={style['error-message']}>{errors.weight}</p>}


                <label htmlFor="image" className={style['form-label']}>
          Image:
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
         className={style['form-input']}
                />
                {errors.image && <p className={style['error-message']}>{errors.image}</p>}

                <label htmlFor="lifeSpan" className={style['form-label']}>
                  LifeSpan:
                </label>
                <input
                  type="text"
                  name="lifeSpan"
                  value={formData.lifeSpan}
                  onChange={handleChange}
                  className={style['form-input']}
                />
                {errors.lifeSpan && <p className={style['error-message']}>{errors.lifeSpan}</p>}

                <label htmlFor="temperament" className={style['form-label']}>
                  Temperaments:
                </label>
                <input
                  type="text"
                  name="temperament"
                  value={formData.temperament}
                  onChange={handleChange}
                  className={style['form-input']}
                />
                {errors.temperament && <p className={style['error-message']}>{errors.temperament}</p>}
                {apiError && <p className={style['error-message']}>{apiError}</p>}
                <button type="submit" className={style['form-button']}disabled={!isFormValid}>
                  Crear Nueva Raza
                </button>
              </form>

           
            </div>
          );
        };

        export default FormPage;