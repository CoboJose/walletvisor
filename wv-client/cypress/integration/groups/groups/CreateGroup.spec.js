const GROUP_NAME = "Group Created"

beforeEach(() => {
    //Navigate
    cy.login()
    cy.navigateToGroups()
    _clickCreateGroupButton()

})

describe('Create Group Test', () => {
  /*it('Create button should be disabled', () => {
    _getCreateGroupModal().within(() => {
      _getCreateButton().should('be.disabled')
    })
  })*/

  it('Should Create Group', () => {
    // CREATE GROUP REQUEST
    cy.intercept('POST', Cypress.env("API_URL") + '/groups', (req) => {
      let group = req.body;
      group.id = 1;
      expect(group.name).to.eq(GROUP_NAME)
      req.reply({statusCode: 200, body: group})
    });
    // GET GROUPS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groups', {
      statusCode: 200,
      body:  _getGroupsBody()
    })

    _getCreateGroupModal().within(() => {
      _getInput(0).clear().type(GROUP_NAME) // Name
      _getCreateButton().click()
    })

    // Modal Closed
    _getCreateGroupModal().should('not.exist')

    // Transaction Created
    cy.contains(GROUP_NAME)
  })
})


function _clickCreateGroupButton() {
  cy.get('[class*="GroupsDashboard_groupsDashboard"]').contains('Create').click()
}

function _getCreateGroupModal() {
  return cy.get('[class*="GroupFormModal_groupFormModal"]')
}

function _getCreateButton() {
  return cy.get('[class*="MuiDialogActions"]').contains('Create')
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getGroupsBody() {
  return [
    {
        "group": {"id":1,"name":GROUP_NAME,"color":"#ad1a1a"},
        "users":
            [
                {"id":1,"email":"user1@test.com","password":"","name":"user1","role":"user"},
                {"id":2,"email":"user2@test.com","password":"","name":"user2","role":"user"}
            ],
        "balance":0
    }
  ]
}