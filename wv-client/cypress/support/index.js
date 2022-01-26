// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';

beforeEach(() => {
    ///////////////////////////
    // DEFAULT API RESPONSES //
    ///////////////////////////
    _stubDefaultApiResponses();

    ///////////////////
    // LOCAL STORAGE //
    ///////////////////
    localStorage.clear();

    ///////////////
    // LOAD PAGE //
    ///////////////
    cy.visit('/')
});

function _stubDefaultApiResponses(){
    // PING
    cy.intercept('GET', Cypress.env("API_URL") + '/ping', {
        statusCode: 200,
        body: "pong",
    })

    // LOGIN
    cy.intercept('POST', Cypress.env("API_URL") + '/auth/login', {
        statusCode: 200,
        fixture: 'auth.json'
    })

    // SIGNUP
    cy.intercept('POST', Cypress.env("API_URL") + '/auth/signup', {
        statusCode: 200,
        fixture: 'auth.json'
    })

    // REFRESH TOKEN
    cy.intercept('GET', Cypress.env("API_URL") + '/auth/refreshToken', {
        statusCode: 200,
        fixture: 'auth.json'
    })

    // GET USER
    cy.intercept('GET', Cypress.env("API_URL") + '/user', {
        statusCode: 200,
        fixture: 'user.json'
    })

    // UPDATE USER
    cy.intercept('PUT', Cypress.env("API_URL") + '/user', {
        statusCode: 200,
        body: 'user.json'
    })

    // GET TRANSACTIONS
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
        statusCode: 200,
        fixture: 'emptyTransactions.json'
    })

    // ADD TRANSACTION
    cy.intercept('POST', Cypress.env("API_URL") + '/transactions', {
        statusCode: 200,
        fixture: 'transaction.json'
    })

    // UPDATE TRANSACTION
    cy.intercept('PUT', Cypress.env("API_URL") + '/transactions', {
        statusCode: 200,
        fixture: 'transaction.json'
    })

    // DELETE TRANSACTION
    cy.intercept('DELETE', Cypress.env("API_URL") + '/transactions?transactionId=*', {
        statusCode: 200,
        body: 'Transaction deleted succesfully'
    })
}