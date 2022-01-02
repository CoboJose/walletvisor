describe('List Transactions Test', () => {
  it('Should handle no transactions', () => {
    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: {transactions: [], totalBalance: 0}
    })
    cy.login()
    cy.clearTransactionDatesSelector()

    // Transaction Created
    cy.contains("No transactions to show").should('exist')
  })

  it('Should handle transactions', () => {
    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: _getTransactionsBody()
    })
    cy.login()
    cy.clearTransactionDatesSelector()

    cy.contains("trn1").should('exist')
  })

  it('Should separate transactions by months', () => {
    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: _getTransactionsBody()
    })
    cy.login()
    cy.clearTransactionDatesSelector()

    cy.contains("December").should('exist')
    cy.contains("November").should('exist')
  })
})

function _getTransactionsBody() {
  return {
    transactions:[
      {
        "amount": 10,
        "category": "salary",
        "date": 1638316800000,
        "id": 1,
        "kind": "income",
        "name": "trn1",
        "userID": 1
      },
      {
        "amount": 5,
        "category": "salary",
        "date": 1635724800000,
        "id": 2,
        "kind": "income",
        "name": "trn2",
        "userID": 1
      }
    ], 
    totalBalance: 15
  }
}