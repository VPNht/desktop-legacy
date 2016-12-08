import { types } from '../actions/logActions';

const defaultState = {
  logs: []
};

export default function LogReducer(state = defaultState, action) {
  switch (action.type) {
    case types.ERROR:
      return {
        ...state,
        ['logs']: [
          ...state['logs'] || [],
          action.payload
        ]
      };
    case types.WARN:
      return {
        ...state,
        ['logs']: [
          ...state['logs'] || [],
          action.payload
        ]
      };
    case types.INFO:
      return {
        ...state,
        ['logs']: [
          ...state['logs'] || [],
          action.payload
        ]
      };
    case types.DEBUG:
      return {
        ...state,
        ['logs']: [
          ...state['logs'] || [],
          action.payload
        ]
      };
    case types.CLEAR:
      return {
        ...state,
        logs: action.payload
      };
    default:
      return state;
  }
}
