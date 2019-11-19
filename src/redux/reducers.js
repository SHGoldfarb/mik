import { combineReducers } from "redux";
import {
  SET_TRANSACTIONS,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  CREATE_OR_UPDATE_TRANSACTION,
  ALL_MONTHS_PENDING,
  ALL_MONTHS_SET,
  MONTH_STATS_PENDING,
  MONTH_STATS_SET,
  ALL_MONTHS_ADD,
  MONTH_TRANSACTIONS_PENDING,
  MONTH_TRANSACTIONS_SET,
  MONTH_DAYS_PENDING,
  MONTH_DAYS_SET,
  DAY_STATS_PENDING,
  DAY_STATS_SET,
  DAY_TRANSACTIONS_PENDING,
  DAY_TRANSACTIONS_SET,
  TRANSACTION_PENDING,
  TRANSACTION_SET,
  ALL_TAGS_PENDING,
  ALL_TAGS_SET,
  SET_FETCHING,
  SET_FETCHED
} from "./actionTypes";
import { CASH } from "../utils/constants";
import {
  selectAllMonthsQuery,
  selectMonthStatsQuery,
  selectMonthTransactionsQuery,
  selectMonthDaysQuery,
  selectDayStatsQuery,
  selectDayTransactionsQuery,
  selectTransactionQuery,
  selectAllTagsQuery
} from "../database/queries";

const createTransaction = ({
  amount,
  type,
  comment = "comment",
  date = new Date().getTime(),
  id,
  tags
}) => ({
  amount,
  date: new Date(date).getTime(),
  account: CASH,
  type,
  comment,
  id,
  tags
});

const getId = object => {
  let exists = true;
  let newId;
  while (exists) {
    newId = Math.random().toString();
    exists = object[newId];
  }
  return newId;
};

const monthsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_MONTHS_PENDING: {
      return { ...state, loading: true, queried: true };
    }
    case ALL_MONTHS_SET: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: payload
      };
    }
    case ALL_MONTHS_ADD: {
      const prevMonths = state.data || [];
      if (prevMonths.includes(payload)) {
        return {
          ...state,
          loading: false,
          loaded: true
        };
      }
      return {
        ...state,
        loading: false,
        loaded: true,
        data: [...prevMonths, payload]
      };
    }
    default:
      return state;
  }
};

const monthStatsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MONTH_STATS_PENDING:
      return {
        ...state,
        [payload]: { ...state[payload], loading: true, queried: true }
      };
    case MONTH_STATS_SET:
      return {
        ...state,
        [payload.monthStr]: {
          ...state[payload.monthStr],
          loading: false,
          loaded: true,
          data: payload.stats
        }
      };
    default:
      return state;
  }
};

const monthDaysReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MONTH_DAYS_PENDING:
      return {
        ...state,
        [payload]: { ...state[payload], loading: true, queried: true }
      };
    case MONTH_DAYS_SET:
      return {
        ...state,
        [payload.monthStr]: {
          ...state[payload.monthStr],
          loading: false,
          loaded: true,
          data: payload.days
        }
      };
    default:
      return state;
  }
};

const monthTransactionsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case MONTH_TRANSACTIONS_PENDING:
      return {
        ...state,
        [payload]: { ...state[payload], loading: true, queried: true }
      };
    case MONTH_TRANSACTIONS_SET:
      return {
        ...state,
        [payload.monthStr]: {
          ...state[payload.monthStr],
          loading: false,
          loaded: true,
          data: payload.transactions
        }
      };
    default:
      return state;
  }
};

const dayStatsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case DAY_STATS_PENDING:
      return {
        ...state,
        [payload]: { ...state[payload], loading: true, queried: true }
      };
    case DAY_STATS_SET:
      return {
        ...state,
        [payload.dayStr]: {
          ...state[payload.dayStr],
          loading: false,
          loaded: true,
          data: payload.stats
        }
      };
    default:
      return state;
  }
};

const dayTransactionsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case DAY_TRANSACTIONS_PENDING:
      return {
        ...state,
        [payload]: { ...state[payload], loading: true, queried: true }
      };
    case DAY_TRANSACTIONS_SET:
      return {
        ...state,
        [payload.dayStr]: {
          ...state[payload.dayStr],
          loading: false,
          loaded: true,
          data: payload.transactions
        }
      };
    default:
      return state;
  }
};

const oldTransactionsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TRANSACTIONS:
      return {
        payload
      };
    case ADD_TRANSACTION: {
      const newTransaction = createTransaction(payload);
      const newId = getId(state);
      return {
        ...state,
        [newId]: newTransaction
      };
    }
    case CREATE_OR_UPDATE_TRANSACTION: {
      const newTransaction = createTransaction(payload);
      const id = newTransaction.id || getId(state);
      return {
        ...state,
        [id]: { ...state[id], ...newTransaction }
      };
    }
    case DELETE_TRANSACTION: {
      const newState = { ...state };
      delete newState[payload];
      return { ...newState };
    }

    default:
      return state;
  }
};

const transactionsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case TRANSACTION_PENDING: {
      const id = payload;
      return {
        [id]: { ...state[id], loading: true, queried: true }
      };
    }
    case TRANSACTION_SET: {
      const transaction = payload;
      const { id } = transaction;
      return {
        ...state,
        [id]: { ...state[id], loading: false, loaded: true, data: transaction }
      };
    }
    default:
      return state;
  }
};

const tagsReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_TAGS_PENDING: {
      return { ...state, loading: true, queried: true };
    }
    case ALL_TAGS_SET: {
      const tags = payload;

      return {
        ...state,
        loading: false,
        loaded: true,
        data: tags
      };
    }
    default:
      return state;
  }
};

export const makeStoreKey = (query, variables) =>
  `${query} ${JSON.stringify(variables)}`;

const dbApiReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FETCHING: {
      const { query, variables } = payload;
      return {
        ...state,
        [makeStoreKey(query, variables)]: { loading: true, fetched: true }
      };
    }
    case SET_FETCHED: {
      const { query, variables, data } = payload;
      return {
        ...state,
        [makeStoreKey(query, variables)]: {
          loading: false,
          fetched: true,
          data
        }
      };
    }
    default:
      return state;
  }
};

export const dbApiStoreKey = "dbApiStoreKey";

export const rootReducer = combineReducers({
  [selectMonthStatsQuery]: monthStatsReducer,
  [selectMonthTransactionsQuery]: monthTransactionsReducer,
  transactions: oldTransactionsReducer,
  [selectAllMonthsQuery]: monthsReducer,
  [selectMonthDaysQuery]: monthDaysReducer,
  [selectDayStatsQuery]: dayStatsReducer,
  [selectDayTransactionsQuery]: dayTransactionsReducer,
  [selectTransactionQuery]: transactionsReducer,
  [selectAllTagsQuery]: tagsReducer,
  [dbApiStoreKey]: dbApiReducer
});
