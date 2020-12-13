/* eslint-disable max-len */
import axios from 'axios';
import fs from 'fs';
import stripHtml from 'string-strip-html';
import {url, token, queryGetAvailableTests, queryGetTestElement, queryGetTestProgram, queryGetTestData, queryGetAnswer, getTestsHeaders} from './constants.js';

let testTitle;
let testId;
let questions;
let answers;
let task;
const ids = [];

(async () => {
  // get available tests
  await axios.post(url, {
    operationName: 'education_programs',
    variables: {
      token,
      order: 'available_desc',
      tag: '',
    },
    query: queryGetAvailableTests,
  },
  {
    headers: getTestsHeaders,
  })
      .then((response) => {
        const availableTests = response.data.data.education_programs.data;
        let i = 0;
        while (availableTests[i].available) {
          ids.push(availableTests[i].id);
          i++;
        }
      })
      .catch((e) => console.error(e));
  console.log(ids);
  // get test names and test ids
  for (const identifiactor of ids) {
    await axios.post(url, {
      operationName: 'education_element_data',
      variables: {
        id: identifiactor,
        token,
      },
      query: queryGetTestElement,
    })
        .then(async (response) => {
          if (response.data.data.education_element_data.elements !== null) {
            const reponsePath = response.data.data.education_element_data.elements[0];
            testTitle = reponsePath.title;
            testId = reponsePath.test[0].id;
            if (reponsePath.task.length) task = stripHtml(reponsePath.task[0].description).result;
            console.log(testTitle, `(testId: ${testId})`);
          } else {
            await axios.post(url, {
              operationName: 'education_program_data',
              variables: {
                id: identifiactor,
                token,
              },
              query: queryGetTestProgram,
            })
                .then((response) => {
                  const reponsePath = response.data.data.education_program_data.block[0].elements[0];
                  testTitle = reponsePath.title;
                  testId = reponsePath.test[0].id;
                  if (reponsePath.task !== undefined) {
                    task = stripHtml(reponsePath.task[0].description).result;
                  }
                  console.log(testTitle, `(testId: ${testId})`);
                })
                .catch((e) => console.error(e));
          }
        })
        .catch((e) => console.error(e));
    // get questions and available answers for the first test
    await axios.post(url, {
      operationName: 'tests_questions',
      variables: {
        test_id: testId,
      },
      query: queryGetTestData,
    })
        .then((response) => {
          const reponsePath = response.data.data.tests_questions;
          questions = reponsePath.questions[0];
          answers = reponsePath.answers[0].map((el) => Object.assign(el, {isTrue: false}));
        })
        .catch((e) => console.error(e));

    // get correct answers for each question
    for (let i = 0; i < questions.length; i++) {
      const availableAnswers = answers.filter((el) => el.question_id === questions[i].id);
      for (let j = 0; j < availableAnswers.length; j++) {
        await axios.post(url, {
          operationName: 'questions_result',
          variables: {
            token,
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
    if (task !== undefined) {
      const taskFileName = `./completed-tests/${shortName}. Задание.txt`;
      if (fs.existsSync(taskFileName)) fs.unlinkSync(taskFileName);
      fs.appendFileSync(taskFileName, task);
      task = undefined;
    }
  }
})();
