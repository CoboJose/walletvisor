beforeEach(() => {
    //Navigate
    cy.login()
})


describe('Delete Invitation Test', () => {
  it('Should Delete User Invitation', () => {
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
    
    cy.get('[class*="MuiListItemSecondaryAction"]').find('button').eq(0).click()
    cy.contains('Group 2').should('not.exist')
  })

  it('Should Delete Group Invitation', () => {
    cy.navigateToGroups()
    cy.contains('Group 1').click()
    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      cy.contains('Members').click()
    })

    // GET GROUP GROUP INVITATIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/group?groupId=*', {
      statusCode: 200,
      body: []
    })

    _getMembersModal().within(() => {
      _getPendingInvitationSection().contains('user3@test.com').should('exist')
      _getDeleteInvitationButton().click()
      _getPendingInvitationSection().contains('user3@test.com').should('not.exist')
    })

  })
})


function _clickEditGroupButton() {
  cy.get('[class*="SelectedGroup_buttons"]').contains('Edit').click()
}

function _getUpdateGroupModal() {
  return cy.get('[class*="GroupFormModal_groupFormModal"]')
}

function _getPendingInvitationSection() {
  return cy.get('[class*="GroupMembers_listHeader"]').siblings().eq(0)
}

function _getDeleteInvitationButton() {
  return _getPendingInvitationSection().find('button').eq(0)
}

function _getMembersModal() {
  return cy.contains('Pending Invitations').parent().parent().parent().parent().parent()
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
