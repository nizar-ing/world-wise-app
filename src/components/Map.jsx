
import styles from './Map.module.css';
import {useSearchParams, useNavigate} from "react-router-dom";
function Map() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    return (
        <div className={styles.mapContainer} onClick={() => navigate('form')}>
            <h1>Map</h1>
            <h3>Position: {lat}, {lng}</h3>
        </div>
    );
}

export default Map;