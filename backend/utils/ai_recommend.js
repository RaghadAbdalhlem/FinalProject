const OpenAI = require("openai");
const mongoose = require("mongoose");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Product = require("../models/Product");

apiKey = process.env.apiKey; 
const openai = new OpenAI({
  apiKey,
});

// Function to get personalized recommendations
async function getRecommendations(userId) {
  try {
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const { dietPreference, goal } = user;

    const favoriteRecipes = await Recipe.find({ favorites: userId }).limit(5);

    // Fetch new recipes and products based on diet preference and goal
    const suggestedRecipes = await Recipe.find({ dietType: dietPreference }).limit(5);
    const suggestedProducts = await Product.find({ category: { $in: ["vitamins", "supplements", "proteins"] } }).limit(5);

    // AI prompt to enhance recommendations
    const prompt = `
      A user with the following details:
      - Diet Preference: ${dietPreference}
      - Goal: ${goal}
      - Favorite Recipes: ${favoriteRecipes.map((r) => r.title).join(", ")}
      
      Based on this information, suggest:
      - 3 personalized recipes that align with their goal and preferences
      - 3 health-related products that complement their diet and fitness plan

      IMPORTANT: Return a valid JSON object with the following structure:
      {
        "recipes": [
          { "title": "string", "ingredients": ["string"], "instructions": "string" }
        ],
        "products": [
          { "name": "string", "category": "string", "benefits": "string" }
        ]
      }
    `;

    // Call GPT-4 API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are a nutrition assistant." }, { role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const text = response.choices[0].message?.content;
    if (!text) {
      console.error("ChatGPT returned an empty response.");
      return [];
    }

    let jsonString = text.trim();
    console.log("Raw ChatGPT response:", jsonString); // Debug log
    
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json/, '').replace(/```/, '').trim();
    }
    
    let recommendArray;
    try {
      recommendArray = JSON.parse(jsonString);
    } catch (err) {
      console.error('Failed to parse JSON from ChatGPT response:', err);
      return [];
    }

    return {
      user: {
        fullName: user.fullName,
        dietPreference,
        goal,
      },
      aiRecommendation: recommendArray,
      favoriteRecipes,
      suggestedRecipes,
      suggestedProducts,
    };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return { error: "Failed to generate recommendations" };
  }
}

module.exports = { getRecommendations };
