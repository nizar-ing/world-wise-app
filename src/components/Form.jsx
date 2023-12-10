// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import {useEffect, useState} from "react";
import DatePicker from 'react-datepicker';
import {useUrlPosition} from "../hooks/useUrlPosition.js";

import {Button} from "./Button";
import BackButton from "./BackButton.jsx";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import {useCities} from "../contexts/CitiesContext.jsx";
import {useNavigate} from "react-router-dom";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState('');
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState('');

    useEffect(() => {
        if(!lat || !lng) return;
        async function fetchCityData(){
            try{
                setIsLoadingGeoCoding(true);
                setGeoCodingError('');
                const response = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
                const data = await response.json();
                if(!data.countryCode) throw new Error("That doesn't seem to be a city. Click somewhere else 😉");
                setCityName(data.city || data.locality || "");
                setCountry(data.countryName);
                setEmoji(convertToEmoji(data.countryCode));
            }catch(err){
                setGeoCodingError(err.message);
            }finally {
                setIsLoadingGeoCoding(false);
            }
        }
        fetchCityData();
    }, [lat, lng]);

   async function handleSubmit(e){
       e.preventDefault();
       if(!cityName || !date) return;
       const newCity = {
           cityName,
           country,
           emoji,
           date,
           notes,
           position: {lat, lng}
       };
       await createCity(newCity);
       navigate('/app/cities');
   }

  if(!lat || !lng) return <Message message='Start by clicking somewhere on the Map.' />
  if(isLoadingGeoCoding) return <Spinner />
  if(geoCodingError) return <Message message={geoCodingError} />
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
         <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/*<input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />*/}
          <DatePicker id="date" selected={date} dateFormat="dd/MM/yyyy" onChange={(date) => setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
