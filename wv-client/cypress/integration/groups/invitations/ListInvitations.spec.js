beforeEach(() => {
    //Navigate
    cy.login()
})


describe('List Invitations Test', () => {
  it('Should List User Invitations', () => {
    // GET USER GROUP INVITATIONS
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/user', {
      statusCode: 200,
      body: _getUserGroupInvitationsBody()
    })
    cy.navigateToUserInvitations()
    cy.contains('Group 2')
    cy.contains('user2@test.com')
  })

  it('Should List Group Invitations', () => {
    // GET GROUP GROUP INVITATIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/group?groupId=*', {
      statusCode: 200,
      body: _getGroupGroupInvitationsBody()
    })

    cy.navigateToGroups()
    cy.contains('Group 1').click()
    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      cy.contains('Members').click()
    })

    cy.contains('user3@test.com')
  })

})

function _clickEditGroupButton() {
  cy.get('[class*="SelectedGroup_buttons"]').contains('Edit').click()
}

function _getUpdateGroupModal() {
  return cy.get('[class*="GroupFormModal_groupFormModal"]')
}

function _getUpdateButton() {
  return cy.get('[class*="MuiDialogActions"]').contains('Update')
}

function _getGroupGroupInvitationsBody(groupName) {
  return [
    {
        "id":1,
        "invitedUserId":3,
        "invitedUserEmail":"user3@test.com",
        "invitedUserName":"user3",
        "inviterUserId":1,
        "inviterUserEmail":"user1@test.com",
        "inviterUserName":"user1",
        "groupId":1,
        "groupName":"Group 1"
    }
  ]
}

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