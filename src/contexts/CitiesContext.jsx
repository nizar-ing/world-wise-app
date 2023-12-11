import {createContext, useContext, useEffect, useReducer, useState} from "react";

const BASE_URL = 'http://localhost:1234';

const CitiesContext = createContext(null);

const INITIAL_STATE = {
    cities: [],
    currentCity: {},
    isLoading: false,
    error: ""
};

function reducer(state, action){
    switch(action.type){
        case 'loading': return { ...state, isLoading: true};
        case 'cities/loaded': return { ...state, isLoading: false, cities: action.payload};
        case 'city/loaded': return { ...state, isLoading: false, currentCity: action.payload};
        case 'city/created': return { ...state, isLoading: false, cities: [ ...state.cities, action.payload], currentCity: action.payload };
        case 'city/deleted': return { ...state, isLoading: false, cities: state.cities.filter((city) => city.id !== action.payload), currentCity: {}};
        case 'rejected': return { ...state, isLoading: false, error: action.payload};
        default: throw new Error('Unknown action type.');
    }
}

function CitiesProvider({ children }){
    /*const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});*/
    const [{cities, currentCity, isLoading, error}, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect( function (){
        async function fetchCities(){
            //setIsLoading(true);
            dispatch({type: 'loading'});
            try{
                const response = await fetch(`${BASE_URL}/cities`);
                const data = await response.json();
                //setCities(data);
                dispatch({type: 'cities/loaded', payload: data});
            } catch {
                dispatch({type: 'rejected', payload: 'Something was wrong during loading cities'});
            }
        }
        fetchCities();
    }, []);

    async function getCity(id){
        if(Number(id) === currentCity.id) return;
        dispatch({type: 'loading' });
        try{
            //setIsLoading(true);
            const response = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await response.json();
            //setCurrentCity(data);
            dispatch({type: 'city/loaded', payload: data});
        } catch {
            dispatch({type: 'rejected', payload: 'Something was wrong during loading city'});
        }
    }

    async function createCity(newCity){
        dispatch({type: 'loading'});
        try{
            //setIsLoading(true);
            const response = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            //setCities((cities) => [ ...cities, data]);
            dispatch({type: 'city/created', payload: data});
        } catch {
            dispatch({type: 'rejected', payload: 'Something was wrong during creating city'});
        }
    }

    async function deleteCity(id){
        dispatch({type: 'loading'});
        try{
            //setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE'
            });
            //setCities((cities) => cities.filter((city) => city.id !== id));
            dispatch({type: 'city/deleted', payload: id});
        } catch {
            dispatch({type: 'city/deleted', payload: 'Something was wrong during deleting city'});
        }
    }

    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            currentCity,
            error,
            getCity,
            createCity,
            deleteCity
        }}>
            {children}
        </CitiesContext.Provider>
    );
}

function useCities(){
    const context = useContext(CitiesContext);
    if(context === undefined ) throw new Error('The CitiesContext was used outside of the CitiesProvider');
    return context;
}

export {CitiesProvider, useCities};