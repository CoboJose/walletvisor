const GROUP_TRN_NAME = "Group Trn Created"

beforeEach(() => {
    //Navigate
    cy.login()
    cy.navigateToGroups()
    cy.contains('Group 1').click()
    cy.contains("Add Transaction").click()
})


describe('Create GroupTransaction Test', () => {
  it('Add button should be disabled', () => {
    _getAddGroupTransactionModal().within(() => {
      _getAddButton().should('be.disabled')
    })
  })
  it('Should Create GroupTransaction', () => {
    // ADD GROUP TRANSACTION REQUEST
    cy.intercept('POST', Cypress.env("API_URL") + '/grouptransactions', (req) => {
      let groupTrn = req.body;
      groupTrn.id = 1;
      expect(groupTrn.groupTransaction.name).to.eq(GROUP_TRN_NAME)
      req.reply({statusCode: 200, body: groupTrn})
    });
    // GET GROUP TRANSACTIONS REQUEST
    cy.intercept('GET', Cypress.env("API_URL") + '/grouptransactions?groupId=*', {
      statusCode: 200,
      body:  _getGroupTransactionsBody()
    })

    _getAddGroupTransactionModal().within(() => {
      _fillInputsValid()
      _clickAddButton()
    })

    // Modal Closed
    _getAddGroupTransactionModal().should('not.exist')

    // Group Transaction Created
    cy.contains(GROUP_TRN_NAME)
  })
})

function _getAddGroupTransactionModal() {
  return cy.contains('Add Group Transaction').parent().parent()
}

function _getInput(inputNumber) {
  return cy.get('input').eq(inputNumber)
}

function _getAddButton() {
  return cy.get('[class*="GroupTransactionFormModal_okButton"]')
}

function _clickAddButton() {
  _getAddButton().click()
}

function _fillInputsValid() {
  _getInput(0).clear().type(GROUP_TRN_NAME) // Name
  _getInput(2).clear().type('10') // Amount
}

function _getGroupTransactionsBody() {
  return [
    {
        "groupTransaction": 
            {
                "id":1,
                "name":GROUP_TRN_NAME,
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