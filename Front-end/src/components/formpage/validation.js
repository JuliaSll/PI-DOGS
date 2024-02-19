const validation = (formData) => {
  const errors = {};

  if (formData.name.trim() === "") {
    errors.name = "El campo no puede estar vacío";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/.test(formData.name)) {
    errors.name = "Debe contener solo caracteres alfabéticos y espacios";
  }

  if (formData.height === "") {
    errors.height = "El campo no puede estar vacío";
  }

  if (formData.height) {
    const heightValues = formData.height
      .split("-")
      .map((value) => parseFloat(value.trim()));

    if (
      heightValues.length !== 2 ||
      isNaN(heightValues[0]) ||
      isNaN(heightValues[1]) ||
      heightValues[0] >= heightValues[1]
    ) {
      errors.height = "Rango de altura no válido";
    }

    if (formData.height.indexOf("-") === -1) {
      errors.height = "Debe incluir '-' en el rango de altura";
    }

    if (heightValues[0].toString().length < 2) {
      errors.height = "El primer dato en altura debe tener al menos 2 dígitos";
    }

    if (heightValues[0] >= heightValues[1]) {
      errors.height =
        "El valor inicial en el rango de altura debe ser menor que el valor final";
    }
  }

  if (formData.weight === "") {
    errors.weight = "El campo no puede estar vacío";
  }

  if (formData.weight) {
    const weightValues = formData.weight
      .split("-")
      .map((value) => parseFloat(value.trim()));

    if (
      weightValues.length !== 2 ||
      isNaN(weightValues[0]) ||
      isNaN(weightValues[1]) ||
      weightValues[0] >= weightValues[1]
    ) {
      errors.weight = "Rango de peso no válido";
    }

    if (weightValues[0] >= weightValues[1]) {
      errors.weight =
        "El valor inicial en el rango de peso debe ser menor que el valor final";
    }

    if (formData.weight.indexOf("-") === -1) {
      errors.weight = "Debe incluir '-' en el rango de peso";
    }
  }

  if (formData.lifeSpan === "") {
    errors.lifeSpan = "El campo no puede estar vacío";
  } else {
    const lifeSpan = formData.lifeSpan
      .split("-")
      .map((value) => parseFloat(value.trim()));

    if (
      lifeSpan.length !== 2 ||
      isNaN(lifeSpan[0]) ||
      isNaN(lifeSpan[1]) ||
      lifeSpan[0] >= lifeSpan[1]
    ) {
      errors.lifeSpan = "Rango de duración de vida no válido";
    }

    if (formData.lifeSpan.indexOf("-") === -1) {
      errors.lifeSpan = "Debe incluir '-' en el rango de duración de vida";
    }

    if (lifeSpan[0] >= lifeSpan[1]) {
      errors.lifeSpan =
        "El valor inicial en el rango de duración de vida debe ser menor que el valor final";
    }
  }

  if (formData.temperament.length === 0) {
    errors.temperament = "Debes seleccionar al menos un temperamento";
  }

  if (formData.image === "") {
    errors.image = "El campo no puede estar vacío";
  }
  return errors;
};

export default validation;
