
import {useNavigate, useSearchParams} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent} from "react-leaflet";
import {useEffect, useState} from "react";
import {useCities} from "../contexts/CitiesContext.jsx";

import {useGeolocation} from "../hooks/useGeoLocation.js";
import {Button} from "./Button.jsx";

import styles from './Map.module.css';

function Map() {
    const [maPosition, setMaPosition] = useState([48.23628429780171, 16.356129201496902]);
    const [searchParams] = useSearchParams();
    const {cities} = useCities();
    const {isLoading: isLoadingPosition, position: geoLocationPosition, getPosition} = useGeolocation();

    const mapLat = searchParams.get('lat');
    const mapLng = searchParams.get('lng');

  useEffect(function(){
      if(mapLat && mapLng) setMaPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

    useEffect(() => {
        if(geoLocationPosition){
            const {lat, lng} = geoLocationPosition;
            setMaPosition([lat, lng]);
        }
    }, [geoLocationPosition]);

    return (
        <div className={styles.mapContainer} >
            {
              !geoLocationPosition && <Button type="position" onClick={getPosition}>{isLoadingPosition ? 'is loading ...' : 'Use Your Position'}</Button>
            }
            <MapContainer className={styles.map} center={maPosition} zoom={6} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {
                    cities.map(({position, id, emoji, cityName}) =>
                        (<Marker key={id} position={[position.lat, position.lng]}>
                            <Popup>
                                <span>{emoji}</span>
                                <span>{cityName}</span>
                            </Popup>
                        </Marker>)
                    )
                }
                <ChangeCenter position={maPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({position}){
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick(){
    const navigate = useNavigate();
    useMapEvent({
        click: ({latlng}) => navigate(`form?lat=${latlng.lat}&lng=${latlng.lng}`)
    });
}

export default Map;