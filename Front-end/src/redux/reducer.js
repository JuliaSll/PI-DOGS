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
    const metricValues = weight.metric.split(" - ");
    const numericValue = parseFloat(metricValues[0]);

    return isNaN(numericValue) ? 0 : numericValue;
  } else if (typeof weight === "string") {
    const imperialValues = weight.split(" - ");
    const numericValue = parseFloat(imperialValues[0]);

    return isNaN(numericValue) ? 0 : numericValue;
  }

  return 0;
};

const initialState = {
  razasOriginales: [],
  razasFiltradas: [],
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
        return {
          ...state,
          filteredDogs: state.razasOriginales,
          selectedTemperament: payload,
        };
      }

      const filterByTemperament = state.razasOriginales.filter((dog) => {
        const dogTemperament = dog.temperament;

        if (!dogTemperament) {
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
      const orderedDogsName = state.razasOriginales
        .slice()
        .sort((a, b) =>
          action.payload === "Ascendente"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );

      return {
        ...state,
        orderedResults: orderedDogsName,
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
