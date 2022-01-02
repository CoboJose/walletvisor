// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
    cy.get('input').eq(0).clear().type('user1@email.com')
    cy.get('input').eq(1).clear().type('C0mplexpass!')
    cy.get('button').click()
})

Cypress.Commands.add('clearTransactionDatesSelector', () => {
    cy.get('[class*="TransactionsDateRange_clearIcon"]').click()
})

Cypress.Commands.add('navigateToConfiguration', () => {
    cy.get('[class*="DesktopSidePanel_principalRoutesList"]').contains('Configuration').click()
})