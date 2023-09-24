const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY;

app.post('/save-story', async (req, res) => {
    const { prompt, generatedStory } = req.body;
  
    const newStory = new Story({ userId: prompt, content: generatedStory });
  
    try {
      await newStory.save();
      console.log('Story saved successfully.');
      res.status(200).json({ message: 'Story saved successfully' });
    } catch (error) {
      console.error('Failed to save story:', error);
      res.status(500).json({ error: 'Failed to save story' });
    }
  });
  
app.post('/completions', async(req, res) => {
    const options = {
      method : "POST",
      headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
      },
        body: JSON.stringify({
            model : "gpt-3.5-turbo",
            messages: [{role: "user",content:req.body.message}],
            max_tokens: 100,
        })
    }

    try{
       const response = await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json()
       res.send(data)
    } catch (error) {
        console.log(error)
    }
})
app.listen(PORT, () => {console.log('Your server is running on PORT ' + PORT)})