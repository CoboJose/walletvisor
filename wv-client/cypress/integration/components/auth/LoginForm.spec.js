describe('LoginForm Test', () => {
  it('Should load', () => {
    cy.visit('/')
    cy.get('h1').contains('Log In').should('exist')

  })
})
