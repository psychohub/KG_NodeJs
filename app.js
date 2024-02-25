const express = require('express')
const app = express()

//routes
app.get('/', (req, res) => {
    res.send('Test node API')
})

app.listen(3000, ()=> {
    console.log(`Node API is running on port 3000`)
})