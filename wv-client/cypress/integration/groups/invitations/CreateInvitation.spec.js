const INVITED_EMAIL = "user4@test.com"

beforeEach(() => {
  // CREATE GROUP INVITATION REQUEST
  cy.intercept('POST', Cypress.env("API_URL") + '/groupinvitations/create', {
    statusCode: 200,
    body: _getCreateGroupInvitationBody()
  })
  //Navigate
  cy.login()
  cy.navigateToGroups()
})


describe('Create Invitation Test', () => {
  it('Should Not Create Invitation With user existing', () => {
    cy.contains('Group 1').click()
    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      cy.contains('Members').click()
    })

    _getMembersModal().within(() => {
      _getInput(0).clear().type('user2@test.com') // Email
      _clickSendInvitationButton()
      cy.contains('User already in the group')
    })

  })

  it('Should Not Create Invitation With user invited', () => {
    cy.contains('Group 1').click()
    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      cy.contains('Members').click()
    })

    _getMembersModal().within(() => {
      _getInput(0).clear().type('user3@test.com') // Email
      _clickSendInvitationButton()
      cy.contains('User already invited')
    })

  })
  
  it('Should Create Invitation', () => {
    cy.contains('Group 1').click()
    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      cy.contains('Members').click()
    })

    // GET GROUP GROUP INVITATIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groupinvitations/group?groupId=*', {
      statusCode: 200,
      body: _getGroupGroupInvitationsBody()
    })

    _getMembersModal().within(() => {
      _getInput(0).clear().type(INVITED_EMAIL) // Email
      _clickSendInvitationButton()
      cy.contains(INVITED_EMAIL)
    })

  })
})

function _clickEditGroupButton() {
  cy.get('[class*="SelectedGroup_buttons"]').contains('Edit').click()
}

function _clickSendInvitationButton() {
  cy.contains('Send').click()
}

function _getUpdateGroupModal() {
  return cy.get('[class*="GroupFormModal_groupFormModal"]')
}

function _getMembersModal() {
  return cy.contains('Pending Invitations').parent().parent().parent().parent().parent()
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getGroupGroupInvitationsBody() {
  return [
    {
        "id":2,
        "invitedUserId":4,
        "invitedUserEmail":INVITED_EMAIL,
        "invitedUserName":"user4",
        "inviterUserId":1,
        "inviterUserEmail":"user1@test.com",
        "inviterUserName":"user1",
        "groupId":1,
        "groupName":"Group 1"
    },
    {
      "id":1,
      "invitedUserId":2,
      "invitedUserEmail":"user2@test.com",
      "invitedUserName":"user2",
      "inviterUserId":1,
      "inviterUserEmail":"user1@test.com",
      "inviterUserName":"user1",
      "groupId":1,
      "groupName":"Group 1"
    }
  ]
}

function _getCreateGroupInvitationBody() {
  return {
    "id": 1,
    "invitedUserId": 4,
    "inviterUserId": 1,
    "groupId": 1
  }
}
