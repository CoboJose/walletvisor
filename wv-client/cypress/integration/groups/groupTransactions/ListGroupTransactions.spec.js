beforeEach(() => {
    //Navigate
    cy.login()
    cy.navigateToGroups()
    cy.contains('Group 1').click()
})


describe('List GroupTransactions Test', () => {
  it('Should List GroupTransactions', () => {
    cy.get('[class*="SelectedGroup_text"]').eq(1).contains('2,50') // You are owned
    cy.get('[class*="SelectedGroup_text"]').eq(2).contains('5,00') // To Receive
    cy.get('[class*="SelectedGroup_text"]').eq(3).contains('2,50') // To Pay
    cy.contains('GT 1')
    cy.contains('GT 2')
    cy.get('[class*="GroupTransactionsList_inactiveList"]').contains('GT 3')

    cy.contains('GT 1').click()
    cy.get('[class*="GroupTransactionFormModal_users"]').contains('user1@test.com')
    cy.get('[class*="GroupTransactionFormModal_users"]').contains('Payed')
    cy.get('[class*="GroupTransactionFormModal_users"]').contains('No')
    cy.get('[class*="GroupTransactionFormModal_users"]').contains('Creator')
    cy.get('[class*="GroupTransactionFormModal_users"]').contains('Yes')
  })
})
