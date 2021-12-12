
const TRANSACTION_NAME = "Test transaction"

beforeEach(() => {
  //Navigate
  cy.login()
  cy.contains("Add Transaction").click()
})

describe('Create Transaction Test', () => {
  it('Should load', () => {
    _getRoot().should('exist')
  })

  it('Add button should be disabled', () => {
    _getRoot().within(() => {
      _getAddButton().should('be.enabled')
    })
  })

  it('Should change categories', () => {
    _getRoot().within(() => {
      // _getInput(1) -> incomeInput
      // _getInput(2) -> expenseInput
      // _getInput(3) -> categoryInput

      _getInput(3).should('have.value', 'salary')

      _getInput(2).click()
      _getInput(3).should('have.value', 'food')

      _getInput(1).click()
      _getInput(3).should('have.value', 'salary')
    })
  })

  it('Should prevent invalid dates', () => {
    _getRoot().within(() => {
      // _getInput(5) -> dateInput

      _fillInputsValid()
      _getAddButton().should('be.enabled')

      _getInput(5).clear().type('32/02/2021')
      _getAddButton().should('be.disabled')
    })
  })

  it('Should create transaction', () => {
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
      statusCode: 200,
      body: _getTransactionsBody()
  })

    _getRoot().within(() => {
      _fillInputsValid()
      _clickAddButton()
    })

    // Modal Closed
    _getRoot().should('not.exist')

    // Transaction Created
    cy.contains(TRANSACTION_NAME)
  })
})

function _getRoot() {
  return cy.get('[class*="TransactionFormModal_transactionFormModal"]')
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getAddButton() {
  return cy.get('[class*="TransactionFormModal_okButton"]')
}

function _clickAddButton() {
  _getAddButton().click()
}

function _fillInputsValid() {
  _getInput(0).clear().type(TRANSACTION_NAME) // Name
  _getInput(4).clear().type('10') // Amount
}

function _getTransactionsBody() {
  return {
    "transactions":[
      {
      "amount": 10,
      "category": "salary",
      "date": 1639267200000,
      "id": 1,
      "kind": "income",
      "name": TRANSACTION_NAME,
      "userID": 1
      }
    ], 
    "totalBalance": 10
  }
}