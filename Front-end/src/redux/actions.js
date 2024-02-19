import {
  SET_ORIGIN_FILTER,
  SET_ORDER_NAME,
  SET_ORDER_WEIGHT,
  SET_TEMPERAMENT_FILTER,
} from "./types";

export const setTemperamentFilter = (temperament) => {
  return { type: SET_TEMPERAMENT_FILTER, payload: temperament };
};

export const setOrderName = (name) => {
  return { type: SET_ORDER_NAME, payload: name };
};

export const setOrderWeight = (weight) => {
  return { type: SET_ORDER_WEIGHT, payload: weight };
};

export const setOriginFilter = (origin) => {
  return { type: SET_ORIGIN_FILTER, payload: origin };
};
