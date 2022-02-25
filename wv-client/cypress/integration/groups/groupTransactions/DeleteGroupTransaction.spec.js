import { getUrlParam } from "../../../support/utils"

const GROUP_TRN_NAME = "GT 1"
const GROUP_TRN_ID = 1

beforeEach(() => {
    //Navigate
    cy.login()
    cy.navigateToGroups()
    cy.contains('Group 1').click()
})


describe('Delete GroupTransaction Test', () => {
  it('Should Delete GroupTransaction', () => {
    // DELETE TRANSACTION REQUEST
    cy.intercept('DELETE', Cypress.env("API_URL") + '/grouptransactions?groupTransactionId=*', (req) => {
      expect(parseInt(getUrlParam(req.url, "groupTransactionId"))).to.eq(GROUP_TRN_ID)
      req.reply({statusCode: 200, body: "Group Transaction deleted succesfully"})
    });
    // GET GROUP TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/grouptransactions?groupId=*', {
      statusCode: 200,
      body:  []
    })

    cy.contains(GROUP_TRN_NAME).click()

    _getEditGroupTransactionModal().within(() => {
      _getDeleteButton().click()
      cy.focused().click()
    })

    // Modal Closed
    _getEditGroupTransactionModal().should('not.exist')

    // Deleted Transaction
    cy.contains(GROUP_TRN_NAME).should('not.exist')
  })
})

function _getEditGroupTransactionModal() {
  return cy.contains('Edit Group Transaction').parent().parent()
}

function _getDeleteButton() {
  return cy.get('[class*="GroupTransactionFormModal_deleteButton"]')
}