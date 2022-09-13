import './App.css';
import React, { useState }from 'react';
import axios from 'axios';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import styled from '@emotion/styled'

const IconStyle = styled.div`
  margin-top: 5px;

`

function App() {
 
    const [data, setData] = useState({})
    const [recommendation, setRecommendation] = useState({})
    const [location, setLocation] = useState('')
    const apiKey = process.env.REACT_APP_OPENWEATHER_APIKEY
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&mode=json&units=imperial&appid=${apiKey}`

      const fourSquareApiKeys = process.env.REACT_APP_FOURSQUARE_APIKEY

      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: fourSquareApiKeys
        }
      };
      

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            axios.get(weatherUrl).then((response) => {
                setData(response.data)
                }) &&
                
                fetch(`https://api.foursquare.com/v3/places/search?categories=13263&near=${location}&sort=RATING&limit=4`, options)
                .then(response => response.json())
                .then((response) => {setRecommendation(response)})
                .catch(err => console.error(err));
                setLocation(' ')
        } 
    }

  return (
   
    <div className="container">
           
           <div className="weather__container">
                <div className="searchbar">
                    <input 
                        value={location}
                        onChange={event => setLocation(event.target.value)}
                        onKeyPress={searchLocation}
                        placeholder="Enter a city..." 
                        type="text"
                    />
                </div>
                <div className="top__weather">
                    <div className="location">
                        <h1>{data.name}</h1>
                    </div>
                    <div className="temp">
                    {data.main ? <h2>{((data.main.temp - 32) * 5/9 ).toFixed()}°C</h2> : null}
                    </div>
                    <div className="description">
                        {data.weather ? <p>{data.weather[0].main}</p> : null}
                    </div>
                    </div>
                    {data.name !== undefined && 
                    
                        <div className="bottom__weather">
                            <div className="feels__like">
                                <p>Feels like</p>
                                {data.main ? <p className='bold'>{((data.main.feels_like - 32) * 5/9).toFixed()}°C</p> : null}
                            </div>
                            <div className="humidity">
                                <p>Humidity</p>
                                {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                            </div>
                            <div className="wind">
                                <p>Wind</p>
                                {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
                            </div>
                        </div>
                    }
            </div>

                {data !== undefined && recommendation?.results !== undefined? 
                <div className="recommendations__outer">
                  <div className="title"> 
                    <p>Where to eat?</p> 
                    <IconStyle>
                      <RestaurantIcon />
                    </IconStyle>
                 
                  </div>

             
                  <div className="recommendations__container">
                    <img src="https://cms-b-assets.familysearch.org/dims4/default/037548c/2147483647/strip/true/crop/800x500+0+0/resize/1240x775!/quality/90/?url=https%3A%2F%2Ffamilysearch-brightspot.s3.amazonaws.com%2F09%2Fbb%2F42cc95c7bee8d9795dc384bde5ef%2Ftraditional-japanese-food-dishes.jpg"></img>
                    <p>{recommendation?.results[0]?.categories[0]?.name}</p>
                    <p>{recommendation?.results[0]?.name}</p>
                    <p>{recommendation?.results[0]?.location?.formatted_address}</p>
                  </div>

              </div> 
              
              : null}

    </div>
  );
}

export default App;

