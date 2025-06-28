import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import FullScreenLoader from './components/FullScreenLoader';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './assets/scss/app-loader.scss';
import { WaterReminderProvider } from './context/WaterReminderContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <CookiesProvider>
        <Suspense fallback={<FullScreenLoader />}>
          <WaterReminderProvider>
            <App />
          </WaterReminderProvider>
        </Suspense>
      </CookiesProvider>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
