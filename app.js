const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const API_KEY = process.env.API_KEY;

app.get('/', (req, res) => {
    res.render('index', { weather: null });
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        res.render('error', { message: 'Please enter a city' });
        return;
    }

    try {
        // First, get the coordinates for the city
        const geocodingResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);
        if (geocodingResponse.data.length === 0) {
            res.render('error', { message: 'City not found' });
            return;
        }
        const { lat, lon } = geocodingResponse.data[0];

        // Then, use the coordinates to get the weather data
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        res.render('index', { weather: weatherResponse.data, city: city });
    } catch (error) {
        res.render('error', { message: 'Error retrieving data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

