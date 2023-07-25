import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactDOM from 'react-dom/client'
import React, { Fragment } from 'react'
import App from '@/pages/Home'
import '@/styles/index.css'

const root = document.getElementById('root')
ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <Fragment>
      <App />
      <ToastContainer />
    </Fragment>
  </React.StrictMode>
)
