/*
    This file is the starting point of the whole app. It finds the root element in
    the html page and renders the Layout component into it. It also wraps everything
    in the redux Provider and the router, so every component can reach the global
    state and move between pages.
*/

import { createRoot } from 'react-dom/client'
import './index.css'
import { Layout } from './components/layout-area/layout/layout'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'


createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Provider>

  
)
