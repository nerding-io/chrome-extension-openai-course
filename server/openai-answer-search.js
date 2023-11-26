// const response = await fetch(
//   "https://api.openai.com/v1/engines/davinci-codex/completions",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Pass user access token in authorization header
//     },
//     body: JSON.stringify({
//       prompt: searchWord + "\nAnswer:",
//       max_tokens: 256,
//       temperature: 0.5,
//       n: 1,
//       stop: "\n",
//     }),
//   }
// );
// const responseData = await response.json();
// const answer = responseData.choices[0].text.trim();
const openai = require("openai");

exports.handler = async (event) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const text = event.body.text;
  const search = event.body.search;
  const role = process.env.OPENAI_ROLE;
  const content = `Find the answer to the following question based on the given text:\n
    T: ${text}\n
    Q: ${search}\nA:
    for example Q: "What is the capital of the United States?"
    Washington, D.C.`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 3600,
    messages: [
      {
        role: "system",
        content: role,
      },
      {
        role: "user",
        content,
      },
    ],
    stop: "\n",
    // user: user.sub, // Pass user id in user field
  });

  const final = response.data.choices[0]?.message.content.split("\n").join("");

  return {
    statusCode: 200,
    body: JSON.stringify({ response: final }),
  };
};
