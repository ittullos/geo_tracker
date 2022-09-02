import React, { useState, useEffect } from 'react'
import * as geolib from 'geolib';
import './App.css'

function App() {

  const [timer, setTimer] = useState(0)
  const [trackerOn, setTrackerOn] = useState(false)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [prevLocation, setPrevLocation] = useState({lat: '', long: ''})
  const [mileage, setMileage] = useState(0)

  // Timer
  useEffect(() => {
    let interval = null

    if (trackerOn) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)

  }, [trackerOn])

  // Geo Tracker
  useEffect(() => {
    let interval = null

    if (trackerOn) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)

          if((prevLocation.lat !== latitude 
            || prevLocation.long !== longitude)
            && (prevLocation.lat !== ''
            && prevLocation.long !== '')) {
              // console.log("made it here")
              console.log(latitude)
              console.log(longitude)
              console.log(prevLocation)
              setMileage(prevMileage => prevMileage + 
                (geolib.getDistance({
                  latitude: latitude,
                  longitude: longitude}, {
                  latitude: prevLocation.lat,
                  longitude: prevLocation.long
                })))
                console.log(mileage)
          }
          setPrevLocation({lat: latitude, long: longitude})
          // console.log("latitude:", latitude)
          // console.log("longitude:", longitude)          
        })
      }, 3000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)

  }, [trackerOn, latitude, longitude, prevLocation, mileage])

  return (
    <div className="App">
      {/* Timer */}
      <div>
        <span>{('0' + Math.floor((timer / 60000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((timer / 1000) % 60)).slice(-2)}:</span>
        <span>{('0' + ((timer / 10) % 100)).slice(-2)}</span>
      </div>
      {/* Mileage */}

      {/* Buttons */}
      <div>
        {!trackerOn && timer === 0 && (
          <button onClick={() => setTrackerOn(true)}>Start</button>
        )}
        {trackerOn && (
          <button onClick={() => setTrackerOn(false)}>Stop</button>
        )}
        {!trackerOn && timer !== 0 && (
          <button onClick={() => setTrackerOn(true)}>Resume</button>
        )}
        {!trackerOn && timer > 0 && (
        <button onClick={() => setTimer(0)}>Reset</button>
        )}
      </div>
    </div>
  )
}

export default App;