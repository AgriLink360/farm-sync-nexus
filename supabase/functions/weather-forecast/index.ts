import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Crop growth models based on weather conditions
const cropModels = {
  rice: {
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 60, max: 80 },
    waterRequirement: 1200, // mm per season
    growthStages: ['seedling', 'tillering', 'heading', 'maturity']
  },
  wheat: {
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 50, max: 70 },
    waterRequirement: 500,
    growthStages: ['germination', 'tillering', 'stem_elongation', 'grain_filling']
  },
  cotton: {
    optimalTemp: { min: 21, max: 30 },
    optimalHumidity: { min: 60, max: 75 },
    waterRequirement: 800,
    growthStages: ['emergence', 'squaring', 'flowering', 'boll_development']
  }
};

function calculateCropPrediction(weatherForecast: WeatherData[], cropType: string): CropPrediction {
  const model = cropModels[cropType as keyof typeof cropModels];
  if (!model) {
    throw new Error(`Crop model not found for ${cropType}`);
  }

  let yieldScore = 100;
  const riskFactors: string[] = [];
  const recommendations: string[] = [];

  // Analyze temperature stress
  const avgTemp = weatherForecast.reduce((sum, day) => sum + day.temperature, 0) / weatherForecast.length;
  if (avgTemp < model.optimalTemp.min) {
    yieldScore -= 15;
    riskFactors.push('Low temperature stress');
    recommendations.push('Consider using protective covers or heating systems');
  } else if (avgTemp > model.optimalTemp.max) {
    yieldScore -= 20;
    riskFactors.push('High temperature stress');
    recommendations.push('Increase irrigation frequency and consider shade nets');
  }

  // Analyze humidity conditions
  const avgHumidity = weatherForecast.reduce((sum, day) => sum + day.humidity, 0) / weatherForecast.length;
  if (avgHumidity < model.optimalHumidity.min) {
    yieldScore -= 10;
    riskFactors.push('Low humidity');
    recommendations.push('Increase irrigation to maintain soil moisture');
  } else if (avgHumidity > model.optimalHumidity.max) {
    yieldScore -= 12;
    riskFactors.push('High humidity - disease risk');
    recommendations.push('Ensure proper ventilation and consider fungicide application');
  }

  // Analyze rainfall
  const totalRainfall = weatherForecast.reduce((sum, day) => sum + day.rainfall, 0);
  const projectedSeasonalRainfall = (totalRainfall / 7) * 120; // Project for 4 months
  
  if (projectedSeasonalRainfall < model.waterRequirement * 0.6) {
    yieldScore -= 25;
    riskFactors.push('Insufficient rainfall');
    recommendations.push('Plan for supplemental irrigation');
  } else if (projectedSeasonalRainfall > model.waterRequirement * 1.5) {
    yieldScore -= 15;
    riskFactors.push('Excessive rainfall - waterlogging risk');
    recommendations.push('Ensure proper drainage systems');
  }

  // Wind stress analysis
  const maxWindSpeed = Math.max(...weatherForecast.map(day => day.windSpeed));
  if (maxWindSpeed > 15) {
    yieldScore -= 8;
    riskFactors.push('High wind speeds');
    recommendations.push('Install windbreaks to protect crops');
  }

  // Calculate final yield percentage
  const expectedYield = Math.max(yieldScore, 20); // Minimum 20% yield
  const confidence = Math.min(95, Math.max(60, 100 - riskFactors.length * 10));

  return {
    cropType,
    expectedYield,
    confidence,
    riskFactors,
    recommendations
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, cropType } = await req.json();
    
    // Using OpenWeatherMap API (free tier)
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Fetch current weather and 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const forecastData = await forecastResponse.json();
    
    // Process weather data for next 7 days
    const weatherForecast: WeatherData[] = forecastData.list.slice(0, 21).map((item: any, index: number) => ({
      temperature: item.main.temp,
      humidity: item.main.humidity,
      rainfall: item.rain?.['3h'] || 0,
      windSpeed: item.wind.speed,
      condition: item.weather[0].main,
      date: new Date(Date.now() + index * 3 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    // Calculate crop prediction
    const cropPrediction = calculateCropPrediction(weatherForecast, cropType);

    return new Response(
      JSON.stringify({
        weather: weatherForecast,
        cropPrediction,
        location: {
          latitude,
          longitude
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in weather-forecast function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weather and crop data', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});