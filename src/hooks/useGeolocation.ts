import { useState, useEffect } from 'react';

interface LocationState {
  coordinates: { lat: number; lng: number } | null;
  loaded: boolean;
  error: { code: number; message: string } | null;
}

const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    coordinates: null, // Default
    loaded: false,
    error: null,
  });

  const onSuccess = (location: GeolocationPosition) => {
    setLocation({
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      loaded: true,
      error: null,
    });
  };

  const onError = (error: GeolocationPositionError) => {
    setLocation({
      coordinates: null, // Fallback location can be set by consumers
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((state) => ({
        ...state,
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true
    });
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
};

export default useGeolocation;
