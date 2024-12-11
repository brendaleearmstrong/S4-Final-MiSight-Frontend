import { Cloud, Wind, CloudRain, CloudSnow, Sun } from 'lucide-react';

export default function WeatherFeed() {
  // Mock weather data - in real app, this would come from a weather API
  const weatherForecast = [
    {
      day: 'Today',
      temp: '2°C',
      windSpeed: '25 km/h',
      windDirection: 'NW',
      condition: 'cloudy',
      precipitation: '20%',
      dustRisk: 'Low',
      icon: Cloud
    },
    {
      day: 'Tomorrow',
      temp: '-1°C',
      windSpeed: '35 km/h',
      windDirection: 'N',
      condition: 'snow',
      precipitation: '70%',
      dustRisk: 'Minimal',
      icon: CloudSnow
    },
    {
      day: 'Wednesday',
      temp: '4°C',
      windSpeed: '40 km/h',
      windDirection: 'SE',
      condition: 'rain',
      precipitation: '80%',
      dustRisk: 'Minimal',
      icon: CloudRain
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Weather & Dust Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherForecast.map((day) => (
          <div key={day.day} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{day.day}</span>
              <day.icon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-2xl font-bold">{day.temp}</p>
              <div className="flex items-center text-gray-600">
                <Wind className="h-4 w-4 mr-1" />
                <span>{day.windSpeed} {day.windDirection}</span>
              </div>
              <p>Precipitation: {day.precipitation}</p>
              <p className={`font-medium ${
                day.dustRisk === 'High' ? 'text-red-600' :
                day.dustRisk === 'Medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                Dust Risk: {day.dustRisk}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}