import { getUrlParam } from "../../support/utils"

const TRN_NAME = "trn 1"
const TRN_ID = 2

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

describe('Delete Transaction Test', () => {
  it('Should delete transaction', () => {
    // DELETE TRANSACTION REQUEST
    cy.intercept('DELETE', Cypress.env("API_URL") + '/transactions?transactionId=*', (req) => {
      expect(parseInt(getUrlParam(req.url, "transactionId"))).to.eq(TRN_ID)
      req.reply({statusCode: 200, body: "Transaction deleted succesfully"})
    });

    cy.contains(TRN_NAME).click()

    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    fixture: 'emptyTransactions.json'
    })

    _getRoot().within(() => {
      _clickDeleteButton()
    })

    // Modal Closed
    _getRoot().should('not.exist')

    // Deleted Transaction
    cy.contains(TRN_NAME).should('not.exist')
  })
})

function _getRoot() {
  return cy.get('[class*="TransactionFormModal_transactionFormModal"]')
}

function _getDeleteButton() {
  return cy.get('[class*="TransactionFormModal_deleteButton"]')
}

function _clickDeleteButton() {
  _getDeleteButton().click()
  cy.focused().click()
}

function _getTransactionsBody(trnName) {
  return {
    transactions:[
      {
      "amount": 10,
      "category": "salary",
      "date": 1639267200000,
      "id": TRN_ID,
      "kind": "income",
      "name": trnName,
      "userID": 1
      }
    ], 
    totalBalance: 10
  }
}