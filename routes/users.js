/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getAPIToDo } = require('../lib/util/api_helpers');

module.exports = (helpers) => {

  router.get('/items', (req, res) => {
    let currentUser = null;
    if (req.session.user_id) {
      currentUser = req.session.user_id;
    };
    //console.log(`current user: ${currentUser}`);
    helpers.getItems(currentUser)
      .then((products) => {
        res.send(products)
      })
  });


  router.get("/users/:id", (req, res) => {

    const userID = req.params.id;
    // set session cookie
    req.session.user_id = userID;
    console.log("just set s.user_id in /:id to", req.session.user_id);
    res.redirect('/');
  });


  router.post('/', (req, res) => {
    const query = req.body.todo;
    const location = req.body.location;
    // getBook(query, (err, book) => {
    //   helpers.addBook(book)
    //     .then(() => { res.json(query) });
    // })

    getAPIToDo(query, location, (a, b, response) => {
      console.log(response);
      res.json(response);
    })

    // getRestaurant(query, location, (a, b, restaurant) => {
    //   helpers.addRestaurant(restaurant)
    //   .then(() => { res.json(query) });
    // })
  });

  router.put('/', (req, res) => {
    const userId = req.session.user_id;
    const todo = req.body.archiveId;
    if (!todo) {
      res.send('400');
    }
    helpers.archiveItem(userId, todo)
    .then(() => { res.send('deleted') })
  })

  router.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
  });

  return router;
};





