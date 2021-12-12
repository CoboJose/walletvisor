beforeEach(() => {
  // CLEAR INPUTS
  for(let i = 0; i < 2; i++){
    _getInput(i).clear()
  }
})

describe('LoginForm Test', () => {
  it('Should load', () => {
    cy.get('h1').contains('Log In').should('exist')
  })

  it('Submit Button should be disabled with empty input', () => {
    cy.get('button').should('be.disabled')
  })

  it('Should give error with invalid email', () => {
    _fillInputsValid()

    let emailInput = _getInput(0)
    emailInput.clear().type('invalidMail@bad')
    _clickSubmitButton()

    _assertTextExists('The email must follow this pattern: example@domain.com')
  })

  it('Should give server error when email dont exists', () => {
    cy.intercept('POST', Cypress.env("API_URL") + '/auth/login', {
      statusCode: 400,
      body: {code: "AU001", debugMessage: "", message:"No account with the given email"}
  })
    _fillInputsValid()

    let emailInput = _getInput(0)
    emailInput.clear().type('notExistingEmail@test.com')
    _clickSubmitButton()
    _assertTextExists('No account with the given email')
  })

  it('Should give server error when password dont exists', () => {
    cy.intercept('POST', Cypress.env("API_URL") + '/auth/login', {
      statusCode: 400,
      body: {code: "AU002", debugMessage: "", message:"Incorrect password"}
  })
    _fillInputsValid()

    let emailInput = _getInput(0)
    emailInput.clear().type('notExistingEmail@test.com')
    _clickSubmitButton()
    _assertTextExists('Incorrect password')
  })

  it('Should login', () => {
    _fillInputsValid()
    _clickSubmitButton()
    _assertTextExists('Transactions')
  })

  it('Should save refreshToken when Remember me is selected and autologin when refreshed', () => {
    _fillInputsValid()
    _getInput(2).click()
    _clickSubmitButton()

    _assertTextExists('Transactions')
    cy.window().its("localStorage").invoke("getItem", "refreshToken").should("exist")

    cy.reload()
    _assertTextExists('Transactions')
  })

  it('Should logout', () => {
    _fillInputsValid()
    _clickSubmitButton()
    _assertTextExists('Transactions')

    //User Icon
    cy.get('[class*="UserIcon_userSvg"]').click()
    //Logout Button
    cy.contains('Logout').click()

    cy.get('h1').contains('Log In').should('exist')
  })
})

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _fillInputsValid() {
  _getInput(0).clear().type('user1@email.com') // Email
  _getInput(1).clear().type('C0mplexpass!') // Password
}

function _clickSubmitButton() {
  cy.get('button').click()
}

function _assertTextExists(text) {
  cy.contains(text).should('exist')
}
