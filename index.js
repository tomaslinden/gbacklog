const app = require('./app') // The Express app
const config = require('./utils/config')

const PORT = config.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
