
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
