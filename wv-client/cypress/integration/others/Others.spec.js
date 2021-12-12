describe('Others Test', () => {
  it('Should change theme', () => {
    cy.login();

    _changeTheme()
    cy.contains('GitHub').should('have.css', 'color', 'rgb(85, 109, 214)')
    
    _changeTheme()
    cy.contains('GitHub').should('have.css', 'color', 'rgb(153, 104, 240)')
  })
})

function _changeTheme() {
  cy.get('[class*="themeButton"]').click()
}
