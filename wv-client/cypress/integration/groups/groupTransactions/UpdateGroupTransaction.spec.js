const GROUP_TRN_NAME = "Group Trn Update"
const GROUP_TRN_NAME_UPDATED = "Group Trn Updated"

beforeEach(() => {
  // GET GROUP TRANSACTIONS REQUEST
  cy.intercept('GET', Cypress.env("API_URL") + '/grouptransactions?groupId=*', {
    statusCode: 200,
    body:  _getGroupTransactionsBody(GROUP_TRN_NAME)
  })
  //Navigate
  cy.login()
  cy.navigateToGroups()
  cy.contains('Group 1').click()
})


describe('Update GroupTransaction Test', () => {
  it('Should Update GroupTransaction', () => {
    // GET GROUP TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/grouptransactions?groupId=*', {
      statusCode: 200,
      body:  _getGroupTransactionsBody(GROUP_TRN_NAME_UPDATED)
    })
    // UPDATE TRANSACTION REQUEST
    cy.intercept('PUT', Cypress.env("API_URL") + '/grouptransactions', (req) => {
      let trn = req.body;
      trn.id = 1;
      expect(trn.name).to.eq(GROUP_TRN_NAME_UPDATED)
      req.reply({statusCode: 200, body: trn})
    });
    cy.contains("Group Trn Update").click()

    _getEditGroupTransactionModal().within(() => {
      _getInput(0).clear().type(GROUP_TRN_NAME_UPDATED) // Name
      _getSaveButton().click()
    })

    // Modal Closed
    _getEditGroupTransactionModal().should('not.exist')

    // Transaction Created
    cy.contains(GROUP_TRN_NAME_UPDATED)
  })
})

function _getEditGroupTransactionModal() {
  return cy.contains('Edit Group Transaction').parent().parent()
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getSaveButton() {
  return cy.get('[class*="GroupTransactionFormModal_okButton"]')
}

function _clickAddButton() {
  _getAddButton().click()
}

function _getGroupTransactionsBody(groupTrnName) {
  return [
    {
        "groupTransaction": 
            {
                "id":1,
                "name":groupTrnName,
                "kind":"expense",
                "category":"shopping",
                "amount":10,
                "date":1645747200000,
                "groupId":1
            },
        "userDTOs":
            [
                {
                    "user":
                        {
                            "id":1,
                            "email":"user1@test.com",
                            "password":"",
                            "name":"user1",
                            "role":"user"
                        },
                    "isCreator":true,
                    "hasPayed":true
                },
                {
                    "user":
                        {
                            "id":2,
                            "email":"user2@test.com",
                            "password":"",
                            "name":"user2",
                            "role":"user"
                        },
                        "isCreator":false,
                        "hasPayed":false
                }
            ],
        "isActive":true
    }
]
}
