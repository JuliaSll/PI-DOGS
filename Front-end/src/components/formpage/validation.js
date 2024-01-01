const validation = (formData) => {
  const errors = {};

  if (formData.name === "") {
    errors.name = "El campo no puede estar vacío";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/.test(formData.name)) {
    errors.name = "Debe contener solo caracteres alfabéticos y espacios";
  }

  if (formData.height === "") {
    errors.height = "El campo no puede estar vacío";
  } else {
    const height = formData.height
      .split("-")
      .map((value) => parseFloat(value.trim()));

    if (
      height.length !== 2 ||
      isNaN(height[0]) ||
      isNaN(height[1]) ||
      height[0] >= height[1]
    ) {
      errors.height = "Rango de altura no válido";
    }
  }

  if (formData.weight === "") {
    errors.weight = "El campo no puede estar vacío";
  } else {
    const weight = formData.weight
      .split("-")
      .map((value) => parseFloat(value.trim()));

    if (
      weight.length !== 2 ||
      isNaN(weight[0]) ||
      isNaN(weight[1]) ||
      weight[0] >= weight[1]
    ) {
      errors.weight = "Rango de peso no válido";
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
  }
  if (formData.temperament === "") {
    errors.temperament = "El campo no puede esta vacio";
  }
  if (formData.image === "") {
    errors.image = "El campo no puede estar vacío";
  } else if (formData.image.length > 255) {
    errors.image = "La imagen debe tener menos de 255 caracteres";
  }

  return errors;
};

export default validation;
