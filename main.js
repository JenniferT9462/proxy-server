// This little js file runs a server

import express from "npm:express@4.18.2";
const app = express();

// NOTE: We would need to to enable CORS for this to work with your JS app. 
// Search for "express enable CORS" for a simple solution.
// TLDR; uncomment these two lines...
import cors from 'npm:cors';
app.use(cors())

// HELLO WORLD server
// Now "/" returns a "hello world"
app.get("/", (_req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

// Now "/hi-class" returns a "hello world"
app.get("/hi-class", (_req, res) => {
  res.send("Hello, how are you?");
});
// // Now "/pattern" returns a "hello world"
// app.get("/pattern", async (_req, res) => {
//   let pattern = await patternQuery("socks");
//   res.json(pattern);
// });



// This is the PROXY SERVER (this will hide the keys for us)
// Define the route
app.get("/fettuccine-alfredo", async (_req, res) => {
  // fetch and return the value from an API
  const recipeList = await fetchIngredientsList("Fettuccine Alfredo");
  // return the value to your client when they `fetch` from you
  const data = {
    ingredients: recipeList
  }
  res.json(data);
});

app.get("/spaghetti-bolognese", async (_req, res) => {
  // fetch and return the value from an API
  const recipeList = await fetchIngredientsList("Spaghetti Bolognese");
  // return the value to your client when they `fetch` from you
  const data = {
    ingredients: recipeList
  }
  res.json(data);
});

app.get("/reuben-sandwich", async (_req, res) => {
  // fetch and return the value from an API
  const recipeList = await fetchIngredientsList("Reuben Sandwich");
  // return the value to your client when they `fetch` from you
  const data = {
    ingredients: recipeList
  }
  res.json(data);
});

app.get("/pattern", async (_req, res) => {
  // fetch and return the value from an API
  const pattern = await patternQuery("socks")
  // return the value to your client when they `fetch` from you
  const data = {
    patternData: pattern
  }
  res.json(data);
});

// start the server
app.listen(3000);


// This is the function that sends the API call.
// You can call any API you want here.
// In this case, we are using one from HuggingFace.
async function fetchIngredientsList(userRecipe) {
  // Get Environment Variable value
  const HG_KEY = Deno.env.get("hg_key");
  // Set the URL
  let url = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1/v1/chat/completions";
  // Set the payload.
  // This is the protocol for a model on HuggingFace.
  let payload = {
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [{role: "user", content: `List only the individual ingredients in ${userRecipe} by order of importance to the recipe. omit any optional ingredients and description of the ingredients. `}],
    max_tokens: 500,
    stream: false
  };
  console.log(payload); // Log for debugging purposes
  // Fetch the API
  let result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Authorization": `Bearer ${HG_KEY}`,
      "Content-Type": "application/json"
    }  
  });
  let data = await result.json();
  console.log(data); // Log for debugging purposes
  // if the data does not exist, send an error
  if(! (data?.choices?.length > 0)) {
    throw { error: "Error in fetch", result: data }
  } else {
    // if it does exist, relay the data to the client.
    let ingredients = data.choices[0].message.content;
    return ingredients;
  }
};

//My fetch from my knitting app
//Fetch with Username and Password Authorization
const username = 'read-b825a6f85ea6c17692eb433a9bb5668d';
const password = '4Nf33VTwOJW3j/TfgxH3/S0w/9YD3M3NTNW5/r0m';

const headers = new Headers();
headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
async function patternQuery(query) {
    console.log('Button is Alive!!');
    // const queryInput = query.value;
    const url = `https://api.ravelry.com/patterns/search.json?query=${query}+free`;
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    //If response is not ok w/'!'
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    //Proof of Life
    console.log(data);
    return data;

}