import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
     <Toaster
        toastOptions={{
          className: "",
          style: {
            border: `1px solid `,
            color: "greena",
            fontSize: "15px",
            marginTop: "100px",
            borderRadius: "10px",
          },
        }}
        autoClose={1000}
        limit={1}
      />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
