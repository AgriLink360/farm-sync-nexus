import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer, 
  Droplets, 
  Wind, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  MapPin,
  Loader2
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  date: string;
}

interface CropPrediction {
  cropType: string;
  expectedYield: number;
  confidence: number;
  riskFactors: string[];
  recommendations: string[];
}

interface WeatherResponse {
  weather: WeatherData[];
  cropPrediction: CropPrediction;
  location: {
    latitude: number;
    longitude: number;
  };
}

const cropOptions = [
  { value: 'rice', label: 'Rice' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'cotton', label: 'Cotton' },
];

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'rain':
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    case 'clouds':
      return <Cloud className="h-6 w-6 text-gray-500" />;
    case 'clear':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    default:
      return <Cloud className="h-6 w-6 text-gray-500" />;
  }
};

const WeatherForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user location
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to Delhi coordinates
          setLocation({ lat: 28.6139, lon: 77.2090 });
        }
      );
    } else {
      // Fallback to Delhi coordinates
      setLocation({ lat: 28.6139, lon: 77.2090 });
    }
  };

  // Fetch weather and crop prediction data
  const fetchWeatherData = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          latitude: location.lat,
          longitude: location.lon,
          cropType: selectedCrop
        }
      });

      if (error) throw error;
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location, selectedCrop]);

  const getYieldColor = (yieldValue: number) => {
    if (yieldValue >= 80) return 'text-green-600';
    if (yieldValue >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weather & Crop Forecast</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {cropOptions.map((crop) => (
                <SelectItem key={crop.value} value={crop.value}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={getCurrentLocation} variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Update Location
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Fetching weather data...</span>
        </div>
      )}

      {weatherData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                7-Day Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.weather.slice(0, 7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(day.condition)}
                      <div>
                        <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{day.condition}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4" />
                        <span>{day.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Droplets className="h-3 w-3" />
                        <span>{day.humidity}%</span>
                        <Wind className="h-3 w-3 ml-2" />
                        <span>{day.windSpeed}m/s</span>
                      </div>
                      {day.rainfall > 0 && (
                        <div className="text-sm text-blue-600">
                          Rain: {day.rainfall}mm
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crop Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Crop Production Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Yield Prediction */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold capitalize">{weatherData.cropPrediction.cropType}</h3>
                <div className={`text-4xl font-bold ${getYieldColor(weatherData.cropPrediction.expectedYield)}`}>
                  {weatherData.cropPrediction.expectedYield}%
                </div>
                <p className="text-muted-foreground">Expected Yield</p>
                <Badge className={getConfidenceColor(weatherData.cropPrediction.confidence)}>
                  {weatherData.cropPrediction.confidence}% Confidence
                </Badge>
              </div>

              {/* Risk Factors */}
              {weatherData.cropPrediction.riskFactors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-1">
                    {weatherData.cropPrediction.riskFactors.map((risk, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {weatherData.cropPrediction.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;