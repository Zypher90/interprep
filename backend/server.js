import app from "./src/index.js"
import {PORT} from "./src/config/env.config.js"
import connectDB from "./src/config/db.config.js"

await connectDB()
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})