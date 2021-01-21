/* eslint-disable max-len */
import axios from 'axios';
import fs from 'fs';
import {
  TOKEN,
  url,
  queryGetTestData,
  queryGetAnswer} from './constants.js';

let questions;
let answers;
let task = [];

// manually changes these two lines
let testId = 6696;
let testTitle = 'Aктуальные вопросы общения с пациентом и эффективные способы защитить себя от преследования';

(async () => {

    // get questions and available answers for the first test
    await axios.post(url, {
      operationName: 'tests_questions',
      variables: {
        test_id: testId,
      },
      query: queryGetTestData,
    })
        .then((response) => {
          const responsePath = response.data.data.tests_questions;
          questions = responsePath.questions[0];
          answers = responsePath.answers[0].map((el) => Object.assign(el, {isTrue: false}));
        })
        .catch((e) => console.error(e));

    // get correct answers for each question
    for (let i = 0; i < questions.length; i++) {
      const availableAnswers = answers.filter((el) => el.question_id === questions[i].id);
      for (let j = 0; j < availableAnswers.length; j++) {
        await axios.post(url, {
          operationName: 'questions_result',
          variables: {
            token: TOKEN,
            answer_id: [{id: availableAnswers[j].id}],
            question_id: questions[i].id},
          query: queryGetAnswer,
        })
            .then((response) => availableAnswers[j].isTrue = response.data.data.questions_result.status)
            .catch((e) => console.error(e));
      }
    }

    // function for creating txt file
    const shortName = testTitle.slice(0, 160).replace(/[<>:"/\|?*]/g, '');
    const fileName = `./completed-tests/${shortName}.txt`;
    if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
    for (let i = 0; i < questions.length; i++) {
      fs.appendFileSync(fileName, (i + 1) + '. ' + questions[i].title + '\n' + '\n');
      answers.map((el) => el.isTrue ? el.isTrue = '+' : el.isTrue = '');
      const availableAnswers = answers.filter((el) => el.question_id === questions[i].id);
      for (let j = 0; j < availableAnswers.length; j++) {
        fs.appendFileSync(fileName, (j + 1) + ') ' + availableAnswers[j].value.trim());
        if (j === (availableAnswers.length - 1)) {
          fs.appendFileSync(fileName, '.' + availableAnswers[j].isTrue);
          if (i !== (questions.length - 1)) {
            fs.appendFileSync(fileName, '\n');
          }
        } else {
          fs.appendFileSync(fileName, ';' + availableAnswers[j].isTrue + '\n');
        }
      }
      if (i !== (questions.length - 1)) {
        fs.appendFileSync(fileName, '\n');
      }
    }
    if (task.length !== 0) {
      for (let i = 0; i < task.length; i++) {
        const taskFileName = `./completed-tests/${shortName}. Задание ${i+1}.txt`;
        if (fs.existsSync(taskFileName)) fs.unlinkSync(taskFileName);
        fs.appendFileSync(taskFileName, task[i]);
      }
      task = [];
    }
})();
