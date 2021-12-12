beforeEach(() => {
  // NAVIGATE
  cy.get('a').eq(0).click()

  // CLEAR INPUTS
  for(let i = 0; i < 2; i++){
    _getInput(i).clear()
  }
})

describe('RegisterForm Test', () => {
  it('Should load', () => {
    cy.get('h1').contains('Sign Up').should('exist')
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

  it('Should give error with invalid password', () => {
    _fillInputsValid()

    let passwordInput = _getInput(1)
    passwordInput.clear().type('badpass')
    _clickSubmitButton()

    _assertTextExists('The password must have: lowercase, uppercase, special character, and more than 8 characters')
  })

  it('Should give server error when email is in use', () => {
    cy.intercept('POST', Cypress.env("API_URL") + '/auth/signup', {
      statusCode: 400,
      body: {code: "AU000", debugMessage: "", message:"The given email is already in use"}
  })
    _fillInputsValid()

    let emailInput = _getInput(0)
    emailInput.clear().type('existingEmail@test.com')
    _clickSubmitButton()
    _assertTextExists('The given email is already in use')
  })

  it('Should register', () => {
    _fillInputsValid()
    _clickSubmitButton()
    _assertTextExists('Transactions')
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
