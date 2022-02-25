beforeEach(() => {
  // GET TRANSACTIONS REQUEST
  cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: _getTransactionsBody()
  })
  
  //Navigate
  cy.login()
  cy.navigateToStatistics()
})

describe('Statistics Test', () => {
  
  it('Should show All statistics', () => {
    cy.contains('Date Selector').should('exist')
    cy.contains('Balance for Selected Dates').should('exist')
    cy.contains('Balance for Last 4 Months').should('exist')
    cy.contains('Incomes Categories Distribution for Selected Dates').should('exist')
    cy.contains('Expenses Categories Distribution for Selected Dates').should('exist')
  })

  it('Should show the Data', () => {
    // Balance Selected Dates
    cy.get('[class*="Statistics_selectedBalanceCard"]').contains('100')
    // Balance Last 4 Months
    cy.get('[class*="Statistics_monthlyBalanceCard"]').contains(new Date().toLocaleString('en-us', { month: 'long' }))
    // Categories Incomes
    cy.get('[class*="Statistics_selectedCategoriesIncomeCard"]').contains('Salary')
    // Categories Expenses
    cy.get('[class*="Statistics_selectedCategoriesExpenseCard"]').contains('Shopping')
  })
})



function _getTransactionsBody() {
  return {
    transactions:[
      {
        "amount": 100,
        "category": "salary",
        "date": new Date(),
        "id": 1,
        "kind": "income",
        "name": "trn1",
        "userID": 1
      },
      {
        "amount": 10,
        "category": "food",
        "date": new Date(),
        "id": 2,
        "kind": "expense",
        "name": "trn2",
        "userID": 1
      },
      {
        "amount": 5,
        "category": "shopping",
        "date": new Date(),
        "id": 3,
        "kind": "expense",
        "name": "trn3",
        "userID": 1
      }
    ], 
    totalBalance: 90
  }
}