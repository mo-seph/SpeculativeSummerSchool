async function generator(params) {
  const openai = new OpenAI(project:"replace");
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {role: "system", content: "You are a helpful assistant."},
      {
        role: "user",
        content: "Write a haiku about recursion in programming.",
      },
    ],
  });
  console.log(completion.choices[0].message);
}

function setup() {
  console.log("test");
}
function draw() {
  generator();
}
