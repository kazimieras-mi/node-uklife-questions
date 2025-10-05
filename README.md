# UK Life — Quiz Generator

A Node.js app that builds a static site with Life in the UK–style quizzes designed for genuine understanding, not just test mimicry.

## What makes it different

* **Deep learning focus:** Each question comes with tricky distractors, then a clear, context-rich explanation after you answer.
* **Learn more links:** Follow-up Wikipedia links for further reading.
* **Great for revision:** A fun trivia experience that can still help you prepare for the official test.

## How it works

* Generates questions and answers using **OpenAI’s GPT-5 API**.
* Outputs a static website you can host anywhere.

> **Note:** Not affiliated with the official *Life in the UK* test or its publishers.

> **Note:** Per the LICENSE, you may not use this tool to generate and host public websites unless they are substantially modified. Please avoid low-effort re-uploads or near-copies. See the LICENSE for full details.

## Usage

### Prerequisites

* Node.js and npm installed

### Install

```bash
git clone https://github.com/kazimieras-mi/node-uklife-questions/
cd node-uklife-questions
npm install
```

### Configure

Create a `.env` file in the project root with the following content:

```dotenv
OPENAI_API_KEY="your key here"
```

Of course, advanced users can set the environment variable differently.

### Prepare content

Add declarative fact sentences to `res/knowledge_pool.txt`. For example:

```txt
The United Kingdom consists of four countries: England, Wales, Scotland, and Northern Ireland. The capital of the United Kingdom is London. The capital of England is London. The capital of Wales is Cardiff. The capital of Scotland is Edinburgh. The capital of Northern Ireland is Belfast. Great Britain is a geographical term used to describe a region that includes England, Wales, and Scotland.
```

Each sentence becomes **one question** in the static site quiz.

### Generate questions

Build `res/question_pool.json`:

```bash
node generate_questions.js
```

Note:
* This will take a while as AI builds the questions, contexts, and Wikipedia links.
* You may cancel at any time. The progress is saved every three questions.
* The knowledge_pool.txt is sampled randomly but evenly.
* Starting this process deletes the old question_pool.json. If you wish to splice two pools, **make a backup ahead of time!**

### Build the site

Create a fully static site in `Website/`:

```bash
node generate_site.js
```

### Deploy

Upload the `Website/` folder to any static host, or open any question in `Website/q/` locally from disk.


---

# Acknowledgements
## New.css
A modified version of the new.css theme from https://github.com/xz/new.css/tree/master is used with the generated website.

The original license for new.css is provided below:

    MIT License
    
    Copyright (c) 2020 Example (https://github.com/3x)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

