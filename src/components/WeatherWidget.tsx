import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertCircle, Loader2 } from 'lucide-react';
import './WeatherWidget.css';

interface WeatherWidgetProps {
  lat: number | undefined;
  lng: number | undefined;
}

interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  locationName: string;
}

// Removed API_KEY check since we're using free Open-Meteo API

const getWmoDescription = (code: number) => {
  if (code === 0) return { condition: 'Clear', description: 'clear sky' };
  if (code === 1) return { condition: 'Clouds', description: 'mainly clear' };
  if (code === 2) return { condition: 'Clouds', description: 'partly cloudy' };
  if (code === 3) return { condition: 'Clouds', description: 'overcast' };
  if (code === 45 || code === 48) return { condition: 'Clouds', description: 'fog' };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', description: 'drizzle' };
  if (code >= 61 && code <= 67) return { condition: 'Rain', description: 'rain' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'snow' };
  if (code >= 80 && code <= 82) return { condition: 'Rain', description: 'rain showers' };
  if (code >= 85 && code <= 86) return { condition: 'Snow', description: 'snow showers' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', description: 'thunderstorm' };
  return { condition: 'Clouds', description: 'unknown' };
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lng }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Location Name (Reverse Geocoding)
        let locationName = 'Current Location';
        try {
          const locRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (locRes.ok) {
            const locData = await locRes.json();
            locationName = locData.address?.city || locData.address?.town || locData.address?.village || locData.address?.county || 'Current Location';
          }
        } catch (e) {
          console.warn("Failed to reverse geocode");
        }

        // 2. Fetch Live Weather from Open-Meteo
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`);
        if (!weatherRes.ok) throw new Error('Failed to fetch weather data');
        const data = await weatherRes.json();
        
        const current = data.current;
        const wmo = getWmoDescription(current.weather_code);

        setWeather({
          temp: Math.round(current.temperature_2m),
          condition: wmo.condition,
          description: wmo.description,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          locationName: locationName
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="weather-icon sun" />;
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return <CloudRain className="weather-icon rain" />;
      case 'clouds':
      default:
        return <Cloud className="weather-icon cloud" />;
    }
  };

  if (!lat || !lng) {
    return (
      <div className="weather-widget loading">
        <Loader2 className="spinner" />
        <p>Waiting for location...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="weather-widget loading">
        <Loader2 className="spinner" />
        <p>Fetching weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <AlertCircle />
        <p>{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-widget glass-panel">
      <div className="weather-main">
        <div className="weather-temp-group">
          {getWeatherIcon(weather.condition)}
          <div className="temp-info">
            <span className="temperature">{weather.temp}°C</span>
            <span className="location">{weather.locationName}</span>
          </div>
        </div>
        <div className="weather-condition">
          {weather.description}
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <Droplets size={16} />
          <span>{weather.humidity}% Humidity</span>
        </div>
        <div className="detail-item">
          <Wind size={16} />
          <span>{weather.windSpeed} m/s Wind</span>
        </div>
      </div>
    </div>
  );
};
