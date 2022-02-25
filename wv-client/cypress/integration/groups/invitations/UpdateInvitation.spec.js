beforeEach(() => {
    //Navigate
    cy.login()
})


describe('Update Invitation Test', () => {
  it('Should Accept Invitation', () => {
    // GET USER INVITATIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/user', {
      statusCode: 200,
      body: _getUserGroupInvitationsBody()
    })

    cy.navigateToUserInvitations()
    cy.contains('Group 2').should('exist')

    // GET USER INVITATIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/user', {
      statusCode: 200,
      body: []
    })
    
    cy.get('[class*="MuiListItemSecondaryAction"]').find('button').eq(1).click()
    cy.contains('Group 2').should('not.exist')
  })
})

function _getUserGroupInvitationsBody() {
  return [
    {
        "id":1,
        "invitedUserId":1,
        "invitedUserEmail":"user1@test.com",
        "invitedUserName":"user1",
        "inviterUserId":2,
        "inviterUserEmail":"user2@test.com",
        "inviterUserName":"user2",
        "groupId":2,
        "groupName":"Group 2"
    }
  ]
}