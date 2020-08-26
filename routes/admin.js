const path = require('path');

const express = require('express');
const { body } = require('express-validator');


const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const PoscodeArea = require('../models/postcodeArea');

const router = express.Router(); 

// /admin/add-post => GET
router.get('/add-post', isAuth, adminController.getAddPost);
router.post(
  '/add-post', 
  isAuth, 
  [ 
    body('postTypeId', 'Ole hyvä ja valitse ilmoituksen tyyppi')
      .isInt({ min: 1, max: 3}),
    body('cityId', 'Ole hyvä ja valitse kaupunki') 
      .isAlpha('sv-SE'), 
    body('postcode', 'Kirjoita kevollinen postinumero')
      .trim() 
      .isLength({ min:5, max: 5})
      .isNumeric()
      .custom((value, { req }) => {
        return PoscodeArea.findOne({ where : { postcode: value}})
          .then(postcodeInfo => {
            if (!postcodeInfo || postcodeInfo.cityName !== req.body.cityId) {
              return Promise.reject('Kirjoita sopiva postinumero kaupungille')
            }
          }) 
      }),
    body('petDate', 'Ole hyvä ja kirjoita päivä oikeassa muodossa')
      .matches(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/),
    body('petTypeId', 'Ole hyvä ja valitse lemmikin tyyppi')
      .isInt({ min: 1, max: 3}),
    body('petGenderId', 'Ole hyvä ja valitse lemmikin sukupuoli')
      .isInt({ min: 1, max: 3}),
    body('title', 'Kirjoita vähintän 5 merkkiä otsikko tekstillä')
      .isLength({ min: 5 })
      .trim(),
    body('content', 'Kirjoita riittävän pitkä ilmoitustekstissä')
      .isLength({ min: 8, max: 400 })
      .trim(),
    body('imageUrl', 'Kirjoita kelvollinen kuvan linkki')
      .isURL()
  ],
  adminController.postAddPost);
router.get('/edit-post/:postId', isAuth, adminController.getEditPost);
router.post(
  '/edit-post', 
  [ 
    body('postTypeId', 'Ole hyvä ja valitse ilmoituksen tyyppi')
      .isInt({ min: 1, max: 3}),
    body('cityId', 'Ole hyvä ja valitse kaupunki') 
      .isAlpha('sv-SE'), 
    body('postcode', 'Kirjoita kevollinen postinumero')
      .trim() 
      .isLength({ min:5, max: 5})
      .isNumeric()
      .custom((value, { req }) => {
        return PoscodeArea.findOne({ where : { postcode: value}})
          .then(postcodeInfo => {
            if (!postcodeInfo || postcodeInfo.cityName !== req.body.cityId) {
              return Promise.reject('Kirjoita sopiva postinumero kaupungille')
            }
          }) 
      }),
    body('petDate', 'Ole hyvä ja kirjoita päivä oikeassa muodossa')
      .matches(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/),
    body('petTypeId', 'Ole hyvä ja valitse lemmikin tyyppi')
      .isInt({ min: 1, max: 3}),
    body('petGenderId', 'Ole hyvä ja valitse lemmikin sukupuoli')
      .isInt({ min: 1, max: 3}),
    body('title', 'Kirjoita vähintän 5 merkkiä otsikko tekstillä')
      .isLength({ min: 5 })
      .trim(),
    body('content', 'Kirjoita riittävän pitkä ilmoitustekstissä')
      .isLength({ min: 8, max: 400 })
      .trim(),
    body('imageUrl', 'Kirjoita kelvollinen kuvan linkki')
      .isURL()
  ],
  isAuth, 
  adminController.postEditPost
);
router.get('/posts', isAuth, adminController.getPosts);
router.post('/delete-post', isAuth, adminController.postDeletePost);




module.exports = router;
