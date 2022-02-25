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

    //////////////
    // VIEWPORT //
    //////////////
    cy.viewport(1300, 800)

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


    // GET GROUPS
    cy.intercept('GET', Cypress.env("API_URL") + '/groups', {
        statusCode: 200,
        fixture: 'groups.json'
    })
    // ADD GROUP
    cy.intercept('POST', Cypress.env("API_URL") + '/groups', {
        statusCode: 200,
        fixture: 'groups.json'
    })
    // UPDATE GROUP
    cy.intercept('PUT', Cypress.env("API_URL") + '/groups', {
        statusCode: 200,
        fixture: 'groups.json'
    })
    // DELETE GROUP
    cy.intercept('DELETE', Cypress.env("API_URL") + '/groups?groupId=*', {
        statusCode: 200,
        body: 'Group deleted succesfully'
    })
    // REMOVE USER FROM GROUP
    cy.intercept('DELETE', Cypress.env("API_URL") + '/groups/removeuser?groupId=*&userId=*', {
        statusCode: 200,
        body: 'User removed succesfully'
    })


    // GET USER GROUP INVITATIONS
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/user', {
        statusCode: 200,
        fixture: 'groupInvitations.json'
    })
    // GET GROUP GROUP INVITATIONS
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/group?groupId=*', {
        statusCode: 200,
        fixture: 'groupInvitations.json'
    })
    // JOIN GROUP
    cy.intercept('POST', Cypress.env("API_URL") + '/groupinvitations/join', {
        statusCode: 200,
        fixture: 'groupInvitations.json'
    })
    // CREATE GROUP INVITATION
    cy.intercept('POST', Cypress.env("API_URL") + '/groupinvitations/create', {
        statusCode: 200,
        fixture: 'groupInvitations.json'
    })
    // DELETE GROUP INVITATION
    cy.intercept('DELETE', Cypress.env("API_URL") + '/groupinvitations/delete?groupInvitationId=*', {
        statusCode: 200,
        body: 'Group Invitation deleted succesfully'
    })


    // GET GROUP TRANSACTIONS
    cy.intercept('GET', Cypress.env("API_URL") + '/grouptransactions?groupId=*', {
        statusCode: 200,
        fixture: 'groupTransactions.json'
    })
    // ADD GROUP TRANSACTION
    cy.intercept('POST', Cypress.env("API_URL") + '/grouptransactions', {
        statusCode: 200,
        body: []
    })
    // UPDATE GROUP TRANSACTION
    cy.intercept('PUT', Cypress.env("API_URL") + '/grouptransactions', {
        statusCode: 200,
        body: []
    })
    // PAY GROUP TRANSACTION
    cy.intercept('POST', Cypress.env("API_URL") + '/grouptransactions/pay', {
        statusCode: 200,
        body: 'Group Transaction payed succesfully'
    })
    // DELETE GROUP TRANSACTION
    cy.intercept('DELETE', Cypress.env("API_URL") + '/grouptransactions?groupTransactionId=*', {
        statusCode: 200,
        body: 'Group Transaction deleted succesfully'
    })
}