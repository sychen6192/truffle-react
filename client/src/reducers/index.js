import { combineReducers } from 'redux';
import { reducer } from 'redux-form';
import { providerReducer } from './reducer-provider';

export default combineReducers({
  provider: providerReducer,
  form: reducer
})