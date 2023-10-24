import {useEffect, useState} from "react";
import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom";

import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import AppLayout from "./pages/AppLayout";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

const BASE_URL = 'http://localhost:1234';

function App() {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect( function (){
        async function fetchCities(){
            try{
                setIsLoading(true);
                const response = await fetch(`${BASE_URL}/cities`);
                const data = await response.json();
                setCities(data);
            } catch {
                alert('Something was wrong during loading data');
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

    return (
      <BrowserRouter>
          <Routes>
              {/* path='/' === index */}
              <Route index element={<Homepage />}/>
              <Route path='product' element={<Product />}/>
              <Route path='pricing' element={<Pricing />}/>
              <Route path='login' element={ <Login />} />
              <Route path='app' element={ <AppLayout /> }>
                  <Route index element={ <Navigate replace to='cities' /> } />
                  <Route path='cities' element={ <CityList cities={cities} isLoading={isLoading} /> } />
                  <Route path='cities/:id' element={ <City /> } />
                  <Route path='countries' element={<CountryList cities={cities} isLoading={isLoading} />} />
                  <Route path='form' element={ <Form /> } />
              </Route>
              <Route path='*' element={<PageNotFound />} />
          </Routes>
      </BrowserRouter>
    );
}

export default App;