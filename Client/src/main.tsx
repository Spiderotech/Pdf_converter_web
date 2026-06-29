
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from './redux/store.ts';
import { initGoogleAnalytics } from './analytics.ts';

const persistor =persistStore(store)

initGoogleAnalytics();

createRoot(document.getElementById('root')!).render(
  <Provider store = {store}>
  <PersistGate persistor={persistor}>
    <App />
  </PersistGate>
  </Provider>
)
