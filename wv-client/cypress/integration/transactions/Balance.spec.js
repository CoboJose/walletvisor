import { getUrlParam } from "../../support/utils"

beforeEach(() => {
  // GET TRANSACTIONS REQUEST
  cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
    statusCode: 200,
    body: {transactions: transactions, totalBalance: 1000}
  })
  //Navigate
  cy.login()
  cy.clearTransactionDatesSelector()
})

describe('Balance Test', () => {
  it('Should render data correctly', () => {
    _getIncomes().contains(150).should('exist')
    _getExpenses().contains(30).should('exist')
    _getRangeBalance().contains(120).should('exist')
    _getTotalBalance().contains('1.000').should('exist')
  })

  it('Should get transactions when dates changes', () => {
    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', (req) => {
      let fromDate = getUrlParam(req.url, "from")
      let toDate = getUrlParam(req.url, "to")
      expect(parseInt(fromDate)).to.eq(1638316800000)
      expect(parseInt(toDate)).to.eq(999999999999999)
      req.reply({statusCode: 200, body: {transactions: transactions, totalBalance: 1000}})
    });
    _getFromDate().type("01/12/2021")

    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', (req) => {
      let fromDate = getUrlParam(req.url, "from")
      let toDate = getUrlParam(req.url, "to")
      expect(parseInt(fromDate)).to.eq(0)
      expect(parseInt(toDate)).to.eq(999999999999999)
      req.reply({statusCode: 200, body: {transactions: transactions, totalBalance: 1000}})
    });
    cy.clearTransactionDatesSelector()

    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', (req) => {
      let fromDate = getUrlParam(req.url, "from")
      let toDate = getUrlParam(req.url, "to")
      expect(parseInt(fromDate)).to.eq(0)
      expect(parseInt(toDate)).to.eq(1638316800000)
      req.reply({statusCode: 200, body: {transactions: transactions, totalBalance: 1000}})
    });

    _getToDate().type("01/12/2021")
  })
})

function _getIncomes() {
  return cy.get('[class*="Balance_income"]')
}

function _getExpenses() {
  return cy.get('[class*="Balance_expense"]')
}

function _getRangeBalance() {
  return cy.get('[class*="Balance_rangeBalance"]')
}

function _getTotalBalance() {
  return cy.get('[class*="Balance_amount"]')
}

function _getFromDate() {
  return cy.get('[class*="TransactionsDateRange_dateRangeSelector"]').find('input').eq(0)
}

function _getToDate() {
  return cy.get('[class*="TransactionsDateRange_dateRangeSelector"]').find('input').eq(1)
}

const transactions = [
  {
    "amount": 100,
    "category": "salary",
    "date": 1638316800000,
    "id": 1,
    "kind": "income",
    "name": "trn1",
    "userID": 1
  },
  {
    "amount": 50,
    "category": "salary",
    "date": 1635724800000,
    "id": 2,
    "kind": "income",
    "name": "trn2",
    "userID": 1
  },
  {
    "amount": 30,
    "category": "food",
    "date": 1635724800000,
    "id": 3,
    "kind": "expense",
    "name": "trn3",
    "userID": 1
  }
]