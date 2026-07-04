const axios = require('axios'); axios.get('http://localhost:3000/bookings/accommodations/unique-hotels?search=Pullman').then(res => console.log(JSON.stringify(res.data.data, null, 2)))  
