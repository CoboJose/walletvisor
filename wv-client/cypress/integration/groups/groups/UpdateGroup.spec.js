const GROUP_NAME = "Group 1"
const GROUP_NAME_UPDATED = "Group 1 updated"

beforeEach(() => {
    // GET GROUPS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groups', {
      statusCode: 200,
      body:  _getGroupsBody(GROUP_NAME)
    })
    //Navigate
    cy.login()
    cy.navigateToGroups()
})


describe('Update Group Test', () => {
  it('Should Update Group', () => {
    // CREATE GROUP REQUEST
    cy.intercept('POST', Cypress.env("API_URL") + '/groups', (req) => {
      let group = req.body;
      group.id = 1;
      expect(group.name).to.eq(GROUP_NAME_UPDATED)
      req.reply({statusCode: 200, body: group})
    });
    // GET GROUPS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groups', {
      statusCode: 200,
      body:  _getGroupsBody(GROUP_NAME_UPDATED)
    })

    cy.contains(GROUP_NAME).click()
    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      _getInput(0).clear().type(GROUP_NAME_UPDATED) // Name
      _getUpdateButton().click()
    })

    // Modal Closed
    _getUpdateGroupModal().should('not.exist')

    // Transaction Created
    cy.contains(GROUP_NAME_UPDATED)
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

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getGroupsBody(groupName) {
  return [
    {
        "group": {"id":1,"name":groupName,"color":"#ad1a1a"},
        "users":
            [
                {"id":1,"email":"user1@test.com","password":"","name":"user1","role":"user"},
                {"id":2,"email":"user2@test.com","password":"","name":"user2","role":"user"}
            ],
        "balance":0
    }
  ]
}