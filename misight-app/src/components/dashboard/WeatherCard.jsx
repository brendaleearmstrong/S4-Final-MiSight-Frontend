// src/components/dashboard/WeatherCard.jsx
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';

export function WeatherCard() {
  const weatherData = {
    current: {
      temp: 22,
      condition: 'Sunny',
      windSpeed: 12
    },
    forecast: [
      { day: 'Today', high: 22, low: 15, condition: 'Sunny' },
      { day: 'Tomorrow', high: 20, low: 14, condition: 'Cloudy' },
      { day: 'Wednesday', high: 18, low: 13, condition: 'Rain' }
    ]
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-amber-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Weather Conditions</h2>
      
      <div className="current-weather mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weatherData.current.temp}°C</div>
            <div className="text-gray-500">{weatherData.current.condition}</div>
          </div>
          {getWeatherIcon(weatherData.current.condition)}
        </div>
        <div className="flex items-center mt-4 text-gray-500">
          <Wind className="h-5 w-5 mr-2" />
          <span>{weatherData.current.windSpeed} km/h</span>
        </div>
      </div>

      <div className="forecast grid grid-cols-3 gap-4">
        {weatherData.forecast.map((day, index) => (
          <div key={index} className="text-center">
            <div className="font-semibold mb-2">{day.day}</div>
            {getWeatherIcon(day.condition)}
            <div className="mt-2">
              <span className="font-semibold">{day.high}°</span>
              <span className="text-gray-500 ml-2">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}