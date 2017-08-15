'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/' , (req, res, next) => {
  knex('users')
    .select( 'id', 'firstname', 'lastname', 'username', 'phone', 'email')
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      console.log(err)
      res.send(err);
    });
});

router.post('/' , (req, res, next) => {
  let firstName = req.body.users.firstName;
  let lastName = req.body.users.lastName;
  let username = req.body.users.username;
  let email = req.body.users.email;
  let phone = req.body.users.phone;

  let letters = /[a-zA-Z]/

  if (!firstName || firstName.trim() === ''){
    const err = new Error ('First name must not be blank')
    err.status = 400;
    return next(err);
  } else if (!lastName || lastName.trim() === ''){
      const err = new Error ('Last name must not be blank')
      err.status = 400;
      return next(err);
  } else if (!username || username.trim() === ''){
      const err = new Error ('username must not be blank')
      err.status = 400;
      return next(err);
  } else if (!email || email.trim() === ''){
      const err = new Error ('email must not be blank')
      err.status = 400;
      return next(err);
  } else if (!phone || phone.trim() === ''){
      const err = new Error ('phone must not be blank')
      err.status = 400;
      return next(err);
  } else if (checkFirstLetterUsername(username) === false){
        const err = new Error ('username start with a letter')
        err.status = 400;
        return next(err);
  } else if (username.length < 6){
      const err = new Error ('username must 6 letters or more')
      err.status = 400;
      return next(err);
  } else if (validateUserName(username) === false){
      const err = new Error ('username must include only letters and numbers')
      err.status = 400;
      return next(err);
  } else if (validateEmail(email) === false){
      const err = new Error ('must enter a valid email')
      err.status = 400;
      return next(err);
  } else if (phone.length !== 10){
    const err = new Error ('must enter a valid phone number')
    err.status = 400;
    return next(err);
  }


  knex('users')
    .insert({
      firstname: firstName,
      lastname: lastName,
      username: username,
      email: email,
      phone: phone
    })
    .returning(['firstname', 'lastname', 'username','phone','email'])
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateUserName (username){
  var valid = true;
  username.split('').forEach(function(el){
      if (!el.match(/[a-zA-Z0-9]/)){
        valid = false
      }
    })
    return valid
}

function checkFirstLetterUsername(username){
  var letters = /[a-zA-Z]/;
  return letters.test(username[0]);
}

module.exports = router;
