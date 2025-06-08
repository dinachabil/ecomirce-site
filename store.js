import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { thunk } from 'redux-thunk'; // ✅ هادي هي الصحيحة

// Créer le store en ajoutant le middleware redux-thunk
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
