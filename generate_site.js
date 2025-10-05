import fs from 'fs/promises';

async function loadQuestionPool() {
    try {
        const data = await fs.readFile('res/question_pool.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading question pool:', error);
        throw error;
    }
}

async function loadQuestionTemplate() {
    try {
        const data = await fs.readFile('res/question.html', 'utf8');
        return data;
    } catch (error) {
        console.error('Error loading question template:', error);
    }
}

async function main() {
    const questionPool = await loadQuestionPool();
    const questionTemplate = await loadQuestionTemplate();

    // Delete existing files.
    await fs.rm('Website/q', { recursive: true, force: true });
    await fs.mkdir('Website/q');

    // Write new files.
    for (const question of questionPool) {
        const index = questionPool.indexOf(question);
        let renderedQuestion = questionTemplate.replace('{{question_json}}', JSON.stringify(question));
        renderedQuestion = renderedQuestion.replace('{{num_questions}}', questionPool.length);
        renderedQuestion = renderedQuestion.replace('{{current_question_num}}', index);
        await fs.writeFile(`Website/q/${index}.html`, renderedQuestion);
    }
}

await main();
