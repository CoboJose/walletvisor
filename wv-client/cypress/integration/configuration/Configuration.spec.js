beforeEach(() => {
  //Navigate
  cy.login()
  cy.navigateToConfiguration()
})

describe('Configuration Test', () => {
  it('Should load user data', () => {
    _getRoot().within(() => {
      _getInput(0).should('have.value', 'user1') // Name
      _getInput(1).should('have.value', 'user1@test.com') // Email
    })
  })

  it('Save button should be disabled', () => {
    _getRoot().within(() => {
      _getSaveButton().should('be.disabled')
    })
  })

  it('Should prevent invalid email and new Password', () => {
    _getRoot().within(() => {
      _getInput(3).clear().type('pass') // Old Password
      _getSaveButton().should('be.enabled')

      _getInput(1).clear().type('invalidMail@bad') //Email
      _getInput(2).clear().type('invalidpass') //New Password
      _clickSaveButton()
      cy.contains('The email must follow this pattern: example@domain.com')
      cy.contains('The password must have: lowercase, uppercase, special character, and more than 8 characters')
    })
  })

  it('Should update user', () => {
    cy.intercept('PUT', Cypress.env("API_URL") + '/user', {
      statusCode: 200,
      body: { email:"user1@test.com",  id: 1, name: "updatedUser", password: "",role: "user" }
    })

    _getRoot().within(() => {
      _getInput(3).clear().type('C0mplexPa$$') // Old Password

      _getInput(0).clear().type('updatedUser') // New Name
      _clickSaveButton()
    })
  })
})

function _getRoot() {
  return cy.get('[class*="Configuration_userConfiguration"]')
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getSaveButton() {
  return cy.get('button').contains('Save')
}

function _clickSaveButton() {
  _getSaveButton().click()
}