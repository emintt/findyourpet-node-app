const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const Member = require('../models/member');

const router = express.Router();

router.get('/signup', authController.getSignup)
router.get('/login', authController.getLogin);
router.post(
  '/signup', 
  [
    body('name')
      .trim().isLength({ min: 1 }).withMessage('Nimi on pakollinen'),
    body('phoneNumber')
      .isMobilePhone('fi-FI').withMessage('Ole hyvä ja näppäile voimassaoleva puhelinnumero'),
    check('email')
      .trim().isLength({ min: 1 }).withMessage('Sähköposti on pakollinen')
      .isEmail()
      .withMessage('Kirjoita kelvollinen sähköpostiosoite.')
      .custom((value, { req }) => {
        return Member.findOne({
          where: { email: value } 
        })
          .then(memberInfo => {
            if (memberInfo) {
              return Promise.reject('Sähköposti on jo olemassa, valitse toinen.');
            }
          })
      }),
    body(
      'password',
      'Anna salasana, jossa on vain merkki ja teksti ja vähintään 6 merkkiä.'
    ) 
      .isLength({min: 6})
      .isAlphanumeric()
      .trim(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Salasanojen on vastattava toisiaan');
      }
      return true;
    })
    
  ],
  authController.postSignup);
router.post(
  '/login', 
  [
    body('email')
      .isEmail()
      .withMessage('Kirjoita kelvollinen sähköpostiosoite.'),
    body('password', 'Salasanan on oltava voimassa')
      .isLength({ min: 6 })
      .isAlphanumeric()
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);

module.exports = router;
