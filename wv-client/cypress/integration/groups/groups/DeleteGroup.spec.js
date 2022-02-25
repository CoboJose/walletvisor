import { getUrlParam } from "../../../support/utils"

const GROUP_NAME = "Group Delete"
const GROUP_ID = 2

beforeEach(() => {
  // GET GROUPS REQUEST
  cy.intercept('GET', Cypress.env("API_URL") + '/groups', {
    statusCode: 200,
    body:  _getGroupsBody()
  })

  //Navigate
  cy.login()
  cy.navigateToGroups()
})


describe('Delete Groups Test', () => {
  it('Should Delete Group', () => {
    // DELETE GROUP REQUEST
    cy.intercept('DELETE', Cypress.env("API_URL") + '/groups?groupId=*', (req) => {
      expect(parseInt(getUrlParam(req.url, "groupId"))).to.eq(GROUP_ID)
      req.reply({statusCode: 200, body: "Group deleted succesfully"})
    });

    cy.contains(GROUP_NAME).click()

    // GET GROUPS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/groups', {
      statusCode: 200,
      body:  []
    })

    _clickEditGroupButton()

    _getUpdateGroupModal().within(() => {
      _getDeleteButton().click()
      cy.focused().click()
    })

    // Modal Closed
    _getUpdateGroupModal().should('not.exist')

    // Transaction Created
    cy.contains(GROUP_NAME).should('not.exist')
  })
})

function _clickEditGroupButton() {
  cy.get('[class*="SelectedGroup_buttons"]').contains('Edit').click()
}

function _getUpdateGroupModal() {
  return cy.get('[class*="GroupFormModal_groupFormModal"]')
}

function _getDeleteButton() {
  return cy.get('[class*="MuiDialogActions"]').contains('Delete')
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getGroupsBody() {
  return [
    {
        "group": {"id":GROUP_ID,"name":GROUP_NAME,"color":"#ad1a1a"},
        "users":
            [
                {"id":1,"email":"user1@test.com","password":"","name":"user1","role":"user"},
                {"id":2,"email":"user2@test.com","password":"","name":"user2","role":"user"}
            ],
        "balance":0
    }
  ]
}