const express = require('express');

// database access using knex
const knex = require('../data/dbConfig.js'); // renamed to knex from db

const router = express.Router();

router.get('/', (req, res) => {
    knex
        .select("*")
        .from('accounts')
        .then(accounts => {
            if(accounts.length === 0){
                res.status(404).json({ errorMessage: "There are no accounts. Add one and try again."})
            } else {
                res.status(200).json(accounts);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error getting the accounts' })
        })
    });

router.post('/', (req, res) => {
    const postData = req.body;
    if(!req.body.name || !req.body.budget){
        res.status(404).json({ errorMessage: "Make sure there is a name and a budget" })
    } else {
        knex('accounts')
        .insert(postData, "id")
        .then(ids => {
            const id = ids[0];
            return knex('accounts')
            .where({id})
            .then(post => {
                res.status(200).json(post)
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error adding the account' })
        })
    }
    
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    if(!req.body.name || !req.body.budget){
        res.status(404).json({ errorMessage: "Update the name or budget" })
    } else {
        knex('accounts')
        .where({ id })
        .update(changes)
        .then(count => {
            if(count === 0){
                res.status(404).json({ errorMessage: "This ID does not exist" })
            } else{
                res.status(201).json({ message: `${count} record(s) updated`})
            }    
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error updating the account' })
        })
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    knex('accounts')
    .where({ id })
    .del(id)
    .then(count => {
        if(count === 0){
            res.status(404).json({ errorMessage: "This ID does not exist" })
        } else{
            res.status(201).json({ message: `${count} record(s) updated`})
        }    
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'error deleting the account' })
    })
});
module.exports = router;