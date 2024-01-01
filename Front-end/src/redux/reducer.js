// reducer.js
import {
  SET_ORIGIN_FILTER,
  SET_ORDER_NAME,
  SET_ORDER_WEIGHT,
  SET_TEMPERAMENT_FILTER,
} from "./types";

export const extractNumericWeight = (weight) => {
  if (!weight) {
    return 0;
  }

  if (typeof weight === "object") {
    // Si el peso es un objeto con la propiedad "metric", usa ese valor
    const metricValues = weight.metric.split(" - ");
    const numericValue = parseFloat(metricValues[0]);

    return isNaN(numericValue) ? 0 : numericValue;
  } else if (typeof weight === "string") {
    // Si el peso es una cadena, toma el primer valor antes del separador "-"
    const imperialValues = weight.split(" - ");
    const numericValue = parseFloat(imperialValues[0]);

    return isNaN(numericValue) ? 0 : numericValue;
  }

  return 0;
};

const initialState = {
  razasOriginales: [], // Guardaremos los datos originales sin cambios
  razasFiltradas: [], // Mantendremos los datos filtrados
  orderName: "Ascendente",
  orderWeight: "Ascendente",
  selectedOrigin: "all",
  selectedTemperament: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEMPERAMENT_FILTER:
      const { payload } = action;

      if (!payload || payload === "") {
        // Si el temperamento es vacío, mostrar todas las razas originales
        return {
          ...state,
          filteredDogs: state.razasOriginales,
          selectedTemperament: payload, // Actualizado aquí
        };
      }

      // Filtrar por temperamento
      const filterByTemperament = state.razasOriginales.filter((dog) => {
        const dogTemperament = dog.temperament;

        if (!dogTemperament) {
          console.error(
            `Undefined temperament for dog: ${JSON.stringify(dog)}`
          );
          return false;
        }

        const dogTemperamentArray = Array.isArray(dogTemperament)
          ? dogTemperament.map((t) => t.trim().toLowerCase())
          : dogTemperament.split(",").map((t) => t.trim().toLowerCase());

        return dogTemperamentArray.includes(temperament.toLowerCase());
      });

      return {
        ...state,
        filteredDogs: filterByTemperament,
        selectedTemperament: action.payload,
      };
    case SET_ORDER_NAME:
      const dogsOrderName = state.razasOriginales
        .slice()
        .sort((a, b) =>
          action.payload === "Ascendente"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
      return {
        ...state,
        razasFiltradas: dogsOrderName,
        orderName: action.payload,
      };

    case SET_ORDER_WEIGHT:
      const dogsOrderWeight = state.razasOriginales
        .slice()
        .sort((a, b) =>
          action.payload === "Ascendente"
            ? extractNumericWeight(a.weight) - extractNumericWeight(b.weight)
            : extractNumericWeight(b.weight) - extractNumericWeight(a.weight)
        );

      return {
        ...state,
        razasFiltradas: dogsOrderWeight,
        orderWeight: action.payload,
      };

    case SET_ORIGIN_FILTER:
      const filterByOrigin = state.razasOriginales.filter((dog) => {
        if (action.payload === "API") {
          return typeof dog.id === "number";
        } else if (action.payload === "Base de Datos") {
          return typeof dog.id === "string" && dog.id.startsWith("db");
        }
        return true;
      });

      return {
        ...state,
        razasFiltradas: filterByOrigin,
        selectedOrigin: action.payload === "" ? "all" : action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
