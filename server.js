require("dotenv").config();
const express = require("express");
require("./config/database")
const userRouter = require("./routes/userRouter")
const geminiRoute = require("./routes/geminiRoute");

const PORT = process.env.PORT

const app = express();

app.use(express.json())
app.use("/api/v1", userRouter)
app.use('/api/', geminiRoute);

app.get('/', (req, res) => {
  res.send('Gemini API is running...');
});

app.listen(PORT, () => {
    console.log(`server is listening to port: ${PORT}`);
    
})
