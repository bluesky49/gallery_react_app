import {combineReducers} from 'redux';
import viewReducer from './viewReducer';
import dataReducer from './dataReducer';

export default combineReducers({
    view: viewReducer,
    data: dataReducer
});