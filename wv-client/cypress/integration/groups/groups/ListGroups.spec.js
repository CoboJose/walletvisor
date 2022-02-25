beforeEach(() => {
    //Navigate
    cy.login()
    cy.navigateToGroups()
})


describe('List Groups Test', () => {
  it('Should List Groups', () => {
    cy.contains('Group 1')
    cy.contains('Group 2')
    cy.contains('10,00')
    cy.contains('-5,00')
    cy.contains('5,00')
  })
})
