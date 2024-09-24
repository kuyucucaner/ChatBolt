const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.generateQuestion = async (req, res) => {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: "Generate a question about cats.",  
      max_tokens: 50,
    });
    const question = completion.data.choices[0].text.trim();  
    res.json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating question' });
  }
};
