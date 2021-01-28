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
let responsePath;

// change these two lines to get tests from selected range
let testId = 1
const totalIds = 10000;

(async () => {

  for (testId; testId < totalIds; testId++) {
    
    const fileName = `./completed-tests/tests-without-title/${testId.toString().padStart(4, '0')}.txt`;

    if (!fs.existsSync(fileName)) {

      // get questions and available answers
      await axios.post(url, {
        operationName: 'tests_questions',
        variables: {
          test_id: testId,
        },
        query: queryGetTestData,
      })
      .then((response) => {
        responsePath = response.data.data.tests_questions;
        questions = responsePath.questions[0];
        answers = responsePath.answers[0].map((el) => Object.assign(el, {isTrue: false}));
      })
      .catch((e) => console.error(e));


      if (answers.length !== 0) {

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
        for (let i = 0; i < questions.length; i++) {
          fs.appendFileSync(fileName, (i + 1) + '. ' + questions[i].title + '\n' + '\n');
          answers.map((el) => el.isTrue ? el.isTrue = '+' : el.isTrue = '');
          const availableAnswers = answers.filter((el) => el.question_id === questions[i].id);
          for (let j = 0; j < availableAnswers.length; j++) {
            fs.appendFileSync(fileName, (j + 1) + ') ' + availableAnswers[j].value.trim().replace(/[;.]$/, ""));
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

        console.log(`Test with id ${testId} was collected`)
      }
          
    }

  }

})();
