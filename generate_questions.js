import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import fs from 'fs/promises';

// Initialize OpenAI API client.
dotenv.config();
const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    }
);

const generateQuestion = async (fact) => {
    // Format response schema.
    const responseSchema = z.object({
        "question": z.string(),
        "options": z.array(z.string()),
        "answer": z.number(),
        "answer-context": z.string(),
        "keywords": z.array(z.string()),
        "image-query": z.string()
    });

    const response = await openai.responses.parse({
        model: "gpt-5",
        reasoning: { effort: "low" },
        input: [
            {
                role: "developer",
                content: "Generate a popular history/popular science/trivia quiz style question about Life in the UK. The question should be testing the knowledge of a fact, which will be provided later. Make the question only a few words, do not meander, but make sure it's a proper short sentence. The answer-context will be revealed to the players after they answer, and should focus on the correct answer, illuminating its significance in a popular science journalistic tone in easy-reading language and 2 paragraphs at most. It should focus on key people, events, technology, science, culture, and history involved, and particularly should focus on the relevance of this information to the question. Try and make the question interesting. Write everything in a style that does not appear AI-generated, for example: avoid em-dashes.\n" +
                    "\n" +
                    "The answer options should be difficult. They should sometimes include 'all of the above' and 'none of the above', and answers which are semantically very close to the correct one. They could be a slightly wrong name, an off-by-one date, but should always be real people, dates, locations, etc. No more than 4 answer options should be given.\n" +
                    "\n" +
                    "Keywords will be converted into English Wikipedia links, and should be things you can reasonably guarantee are on the Wikipedia. There should be a max of 5.\n" +
                    "\n" +
                    "The image-query is a few-word query to find an appropriate image to go with the question on various image databases, like Wikimedia. It should be very generic, such as 'United Kingdom', 'National Health Service Logo'\n" +
                    "\n" +
                    "Example:" +
                    "{\n" +
                    "    \"question\": \"When did Alexander Fleming first discover the effects of Penicillin?\",\n" +
                    "    \"options\": [\n" +
                    "      \"1928\",\n" +
                    "      \"1929\",\n" +
                    "      \"1931\",\n" +
                    "      \"1930\"\n" +
                    "    ],\n" +
                    "    \"answer\": 0,\n" +
                    "    \"answer-context\": \"In 1928, Scottish bacteriologist Alexander Fleming noticed something odd: a stray mould had invaded one of his Petri dishes and wiped out the surrounding staphylococcal bacteria. The mould, later identified as Penicillium notatum, produced a substance with remarkable antibacterial power. Fleming named it “penicillin” and published his findings, but the compound proved unstable and nearly impossible to purify with the tools of the time. His discovery remained more of a scientific curiosity than a usable medicine — a tantalising glimpse of what might be possible.\\n\\nA decade later, Howard Florey, Ernst Chain, and Norman Heatley at the University of Oxford took up the challenge. Using new chemical extraction methods, fermentation techniques, and animal trials, they proved penicillin’s lifesaving potential. The Second World War pushed their breakthrough from lab bench to factory floor, with American industry scaling up production through deep-tank fermentation. By the war’s end, penicillin was saving soldiers and civilians alike, ushering in the antibiotic era. In 1945, Fleming, Florey, and Chain shared the Nobel Prize, their story forever tied to a mix of lucky observation, rigorous science, and the sheer urgency of global conflict.\",\n" +
                    "    \"keywords\": [\n" +
                    "      \"Alexander Fleming\",\n" +
                    "      \"Penicillin\",\n" +
                    "      \"Howard Florey\",\n" +
                    "      \"Ernst Chain\",\n" +
                    "      \"Nobel Prize in Physiology or Medicine\"\n" +
                    "    ],\n" +
                    "    \"image-query\": \"penicillin\"\n" +
                    "  }"
            },
            {
                role: "user",
                content: "Please generate a question to test the knowledge of this fact: " + fact,
            },
        ],
        text: {
            format: zodTextFormat(responseSchema, "question"),
        }
    });

    if(!response.error) {
        try {
            return response.output_parsed;
        } catch (error) {
            console.error('Output failed:', error);
        }
    } else {
        console.error('Response failed:', response.error);
    }

    return null;
}

const main = async () => {
    // Init knowledge pool.
    const knowledgePool = await fs.readFile('res/knowledge_pool.txt', 'utf8');
    let knowledgeFacts = knowledgePool.split('.');
    knowledgeFacts = knowledgeFacts.filter(fact => fact.trim() !== '');

    // Shuffle facts.
    for (let i = knowledgeFacts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [knowledgeFacts[i], knowledgeFacts[j]] = [knowledgeFacts[j], knowledgeFacts[i]];
    }

    const questionPoolArray = [];
    const flushPool = async () => await fs.writeFile('res/question_pool.json', JSON.stringify(questionPoolArray, null, 2));

    const printQuestion = (question) => {
        console.log(`Question: ${question['question']}`);
        console.log(`Options: ${question['options']}`);
        console.log(`Answer: ${question['options'][question['answer']]}`);
        console.log(`Keywords: ${question['keywords']}`);
        console.log(`Image Query: ${question['image-query']}`);
        console.log(`\n`);
    }

    let idx = 0;
    for (const fact of knowledgeFacts) {
        // Generate a question.
        console.log(`Generating question for fact: ${fact}.`);
        const question = await generateQuestion(fact);

        if(question !== null) {
            // Debug print.
            printQuestion(question);

            // Store and advance.
            questionPoolArray.push(question);
            idx++;
            if(idx % 3 === 0) {
                await flushPool();
            }
        }
        if(idx > 30)
        {
            break;
        }
    }
    await flushPool();
}

await main();

