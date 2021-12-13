
const TRN_NAME = "trn 1"
const TRN_NAME_UPDATED = "trn 1 updated"

beforeEach(() => {
  // GET TRANSACTIONS REQUEST
  cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: _getTransactionsBody(TRN_NAME)
  })

  //Navigate
  cy.login()
  cy.clearTransactionDatesSelector()
})

describe('Update Transaction Test', () => {
  it('Should update transaction', () => {
    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: _getTransactionsBody(TRN_NAME_UPDATED)
    })
    // UPDATE TRANSACTION REQUEST
    cy.intercept('PUT', Cypress.env("API_URL") + '/transactions', (req) => {
      let trn = req.body;
      trn.id = 1;
      expect(trn.name).to.eq(TRN_NAME_UPDATED)
      req.reply({statusCode: 200, body: trn})
    });

    cy.contains(TRN_NAME).click()

    _getRoot().within(() => {
      _getInput(0).clear().type(TRN_NAME_UPDATED) // Name
      _clickAddButton()
    })

    // Modal Closed
    _getRoot().should('not.exist')

    // Transaction Created
    cy.contains(TRN_NAME_UPDATED)
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

function _getTransactionsBody(trnName) {
  return {
    transactions:[
      {
      "amount": 10,
      "category": "salary",
      "date": 1639267200000,
      "id": 1,
      "kind": "income",
      "name": trnName,
      "userID": 1
      }
    ], 
    totalBalance: 10
  }
}