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

// NOTE: For a real app, use an API key in .env (e.g. VITE_OPENWEATHER_API_KEY)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''; 

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lng }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;
    
    if (!API_KEY) {
       // Mock weather if no API key is provided
       setLoading(true);
       setTimeout(() => {
           setWeather({
               temp: 28,
               condition: 'Clouds',
               description: 'scattered clouds',
               humidity: 65,
               windSpeed: 4.2,
               locationName: 'Current Location (Mock)'
           });
           setLoading(false);
       }, 800);
       return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          locationName: data.name
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
