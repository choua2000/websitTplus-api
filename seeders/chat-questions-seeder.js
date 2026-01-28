'use strict';

import { ChatQuestion, ChatQuestionTrans, NextQuestion } from '../models';
import { DOMAIN } from '../constants/index';
import { baseQuestions } from './seederData/chatQuestionData';
import { subQuestion } from './seederData/subQuestionData';
import { chatQuestionImage } from "./seederData/chatQuestionImage"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});*/
    for (let i = 0; i < baseQuestions.length; i++) {
      const questionId = await ChatQuestion.create({});
      for (let [key, value] of Object.entries(baseQuestions[i])) {

        await ChatQuestionTrans.create(
          {
            question: value,
            answer: "",
            languageId: key,
            chatQuestionId: questionId.id,
            bot: true,
            image_option: false
          }
        );
      }

      for (let [key, value] of Object.entries(subQuestion[i])) {
        console.log(`adding ${key} : ${value}`)
        const questionId1 = await ChatQuestion.create({});
        await ChatQuestionTrans.create(
          {
            question: key,
            answer: value,
            languageId: 1,
            chatQuestionId: questionId1.id,
            bot: true,
            image_option: false
          }
        );
        await ChatQuestionTrans.create(
          {
            question: key,
            answer: value,
            languageId: 2,
            chatQuestionId: questionId1.id,
            bot: true,
            image_option: false
          }
        );

        await NextQuestion.create({
          questionId: questionId.id,
          nextQuestion: questionId1.id
        });
      }
      // *image question
      if (i == 0 || i == 1) {

        for (let [key, value] of Object.entries(chatQuestionImage[i])) {
          console.log(`adding ${key} : ${value}`)
          const questionId1 = await ChatQuestion.create({});
          await ChatQuestionTrans.create(
            {
              question: key,
              answer: value,
              languageId: 1,
              chatQuestionId: questionId1.id,
              bot: true,
              image_option: true
            }
          );
          await ChatQuestionTrans.create(
            {
              question: key,
              answer: value,
              languageId: 2,
              chatQuestionId: questionId1.id,
              bot: true,
              image_option: true
            }
          );

          await NextQuestion.create({
            questionId: questionId.id,
            nextQuestion: questionId1.id
          });
        }

      }



    }





  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
