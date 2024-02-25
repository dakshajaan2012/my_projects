
import React from 'react';
import styles from './CloudyIcon.module.css';

const CloudyIcon = (props) => {
  const { weatherDescription } = props;

  const getIconUrl = (description, iconCode) => {
    // Map weather descriptions to corresponding OpenWeatherMap icon URLs
    const baseUrl = 'https://openweathermap.org/img/wn/';
    
    // Convert the description to lowercase for case-insensitive comparison
    const lowercaseDescription = description.toLowerCase();
    
    // Check if it's night based on the icon code suffix
    const isNight = iconCode && iconCode.endsWith('n');
  
    switch (lowercaseDescription) {
      case 'clear sky':
        return `${baseUrl}01${isNight ? 'n' : 'd'}@2x.png`;
        
      case 'few clouds':
        return `${baseUrl}02${isNight ? 'n' : 'd'}@2x.png`;
  
      case 'scattered clouds':
        return `${baseUrl}03${isNight ? 'n' : 'd'}@2x.png`;
  
      case 'broken clouds':
      case 'overcast clouds':
        return `${baseUrl}04${isNight ? 'n' : 'd'}@2x.png`;

      case 'light intensity shower rain':
      case 'shower rain':
      case 'heavy intensity shower rain':
      case 'ragged shower rain':
      case 'light intensity drizzle':
      case 'drizzle':
      case 'heavy intensity drizzle':
      case 'light intensity drizzle rain':
      case 'drizzle rain':
      case 'heavy intensity drizzle rain':
      case 'shower rain and drizzle':
      case 'heavy shower rain and drizzle':
      case 'shower drizzle':
        return `${baseUrl}09${isNight ? 'n' : 'd'}@2x.png`;

      case 'rain':
      case 'light rain':
      case 'moderate rain':
      case 'heavy intensity rain':
      case 'very heavy rain':
      case 'extreme rain':
        return `${baseUrl}10${isNight ? 'n' : 'd'}@2x.png`;

      case 'thunderstorm with light rain':
      case 'thunderstorm with rain':
      case 'thunderstorm with heavy rain':
      case 'light thunderstorm':
      case 'thunderstorm':
      case 'heavy thunderstorm':
      case 'ragged thunderstorm':
      case 'thunderstorm with light drizzle':
      case 'thunderstorm with drizzle':
      case 'thunderstorm with heavy drizzle':
        return `${baseUrl}11${isNight ? 'n' : 'd'}@2x.png`;

      case 'snow':
      case 'light snow':
      case 'heavy snow':
      case 'sleet':
      case 'light shower sleet':
      case 'shower sleet':
      case 'light rain and snow':
      case 'rain and snow':
      case 'light shower snow':
      case 'shower snow':
      case 'heavy shower snow':
      case 'freezing rain':
        return `${baseUrl}13${isNight ? 'n' : 'd'}@2x.png`;

      case 'mist':
      case "smoke":
      case 'haze':
      case "sand/dust whirls":
      case 'fog':
      case "sand":
      case 'dust':
      case "volcanic ash":
      case 'squalls':
      case "tornado":
        return `${baseUrl}50${isNight ? 'n' : 'd'}@2x.png`;
  
      default:
        return `${baseUrl}01${isNight ? 'n' : 'd'}@2x.png`; // Default to clear sky icon
    }
  };
  
  return (
    <div>
      
      <img className={styles.image} src={getIconUrl(weatherDescription)} alt={weatherDescription} />
    </div>
  );
};

export default CloudyIcon;
