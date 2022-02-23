const TRN_NAME = "trn 1"

beforeEach(() => {
  //Navigate
  cy.login()
  cy.clearTransactionDatesSelector()
  cy.contains("Add Transaction").click()
})

describe('Create Transaction Test', () => {
  it('Should load', () => {
    _getRoot().should('exist')
  })

  it('Add button should be disabled', () => {
    _getRoot().within(() => {
      _getAddButton().should('be.disabled')
    })
  })

  it('Should change categories', () => {
    _getRoot().within(() => {
      // _getInput(1) -> incomeInput
      // _getInput(2) -> expenseInput
      // _getInput(3) -> categoryInput

      _getInput(3).should('have.value', 'shopping')

      _getInput(1).click()
      _getInput(3).should('have.value', 'salary')

      _getInput(2).click()
      _getInput(3).should('have.value', 'food')
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
    // ADD TRANSACTION REQUEST
    cy.intercept('POST', Cypress.env("API_URL") + '/transactions', (req) => {
      let trn = req.body;
      trn.id = 1;
      expect(trn.name).to.eq(TRN_NAME)
      req.reply({statusCode: 200, body: trn})
    });
    // GET TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/transactions?from=*&to=*', {
      statusCode: 200,
      body:  _getTransactionsBody()
    })

    _getRoot().within(() => {
      _fillInputsValid()
      _clickAddButton()
    })

    // Modal Closed
    _getRoot().should('not.exist')

    // Transaction Created
    cy.contains(TRN_NAME)
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
  _getInput(0).clear().type(TRN_NAME) // Name
  _getInput(4).clear().type('10') // Amount
}

function _getTransactionsBody() {
  console.log('now!')
  return {
      transactions:[ 
        {
        "amount": 10,
        "category": "salary",
        "date": 1639267200000,
        "id": 1,
        "kind": "income",
        "name": TRN_NAME,
        "userID": 1
        }
      ], 
      totalBalance: 10
    }
}