import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes';
import store from './store';
import './styles/global.css';

console.log('Loading DMT Education App...');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found, rendering App...');
  console.log('BASE_URL:', import.meta.env.BASE_URL);
  
  ReactDOM.render(
    <React.StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <BrowserRouter 
            basename={import.meta.env.BASE_URL}
          >
            <AppRoutes />
          </BrowserRouter>
        </Provider>
      </HelmetProvider>
    </React.StrictMode>,
    rootElement
  );
  console.log('App rendered successfully!');
} else {
  console.error('Root element not found!');
}
