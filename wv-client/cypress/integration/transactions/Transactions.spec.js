describe('Welcome Test', () => {
  it('Should load', () => {
    cy.contains('WALLETVISOR').should('exist')
  })

  it('Should switch to register form', () => {
    cy.contains('Log In').should('exist')

    cy.get('a').eq(0).click()
    cy.contains('Sign Up').should('exist')

    cy.get('a').eq(0).click()
    cy.contains('Log In').should('exist')
  })
})
