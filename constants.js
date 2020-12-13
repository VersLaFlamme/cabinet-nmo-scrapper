/* eslint-disable max-len */
export const url = 'https://cabinet-nmo.ru/api';
export const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvY2FiaW5ldC1ubW8ucnVcL2FwaSIsImlhdCI6MTYwNzQ1MDA0MCwiZXhwIjoxNjM4OTg2MDQwLCJuYmYiOjE2MDc0NTAwNDAsImp0aSI6IkZHVWNNR25yblVMZEpWOVEiLCJzdWIiOjQ2MjE5LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Ym3E1e1pZml3o6fcXhbmqfulPYANDn2mJdnkHioiIUs';
export const queryGetTestElement = 'query education_element_data($id: Int!, $token: String) {\n  education_element_data(id: $id, token: $token) {\n    elements {\n      id\n      title\n      description\n      text\n      test {\n        id\n        completed\n        __typename\n      }\n      presentations {\n        id\n        file\n        name\n        __typename\n      }\n      youtube {\n        id\n        video_id\n        video_name\n        video_tags\n        video_uploaded\n        completed\n        video_image\n        time\n        total_time\n        __typename\n      }\n      documents {\n        file\n        completed\n        name\n        id\n        __typename\n      }\n      task {\n        title\n        description\n        id\n        correct\n        answered\n        __typename\n      }\n      meetings {\n        id\n        slug\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n';
export const queryGetTestProgram = 'query education_program_data($id: Int!, $token: String) {\n  education_program_data(id: $id, token: $token) {\n    program {\n      id\n      title\n      description\n      time_to_end\n      __typename\n    }\n    block {\n      id\n      title\n      description\n      elements {\n        id\n        title\n        description\n        test {\n          id\n          block_id\n          title\n          description\n          __typename\n        }\n        youtube {\n          video_id\n          video_name\n          video_tags\n          video_description\n          video_uploaded\n          __typename\n        }\n        documents {\n          file\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n';
export const queryGetAnswer = 'mutation questions_result($token: String!, $answer_id: [question_answer], $question_id: Int!) {\n  questions_result(token: $token, answer_id: $answer_id, question_id: $question_id) {\n    status\n    status_message\n    __typename\n  }\n}\n';
export const queryGetTestData = 'query tests_questions($test_id: Int!) {\n  tests_questions(test_id: $test_id) {\n    id\n    answers {\n      value\n      question_id\n      id\n      multiple\n      __typename\n    }\n    questions {\n      id\n      title\n      image\n      __typename\n    }\n    __typename\n  }\n}\n';
export const queryGetAvailableTests = 'query education_programs($token: String, $order: String, $tag: String) {\n  education_programs(token: $token, order: $order, tag: $tag, program_144: true) {\n    data {\n      program_144\n      update_banner\n      trial\n      periodic\n      popular\n      trial_video\n      dates {\n        start_date\n        end_date\n        __typename\n      }\n      id\n      available\n      description\n      id\n      image\n      icon\n      end_date\n      icon\n      start_date\n      title\n      price\n      old_price\n      tag\n      required_documents\n      slug\n      list\n      zet\n      video_count\n      tests_count\n      __typename\n    }\n    __typename\n  }\n}\n';
export const getTestsHeaders = {
  authorization: `bearer ${token}`,
  Host: 'cabinet-nmo.ru',
  Origin: 'https://vrachu.ru',
  Referer: 'https://vrachu.ru/training',
};
