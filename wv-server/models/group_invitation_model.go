package models

import (
	"database/sql"
	"errors"
	"wv-server/utils"
)

// GroupInvitation represents a user of the application
type GroupInvitation struct {
	ID            int `json:"id"`
	InvitedUserId int `json:"invitedUserId" db:"invited_user_id"`
	InviterUserId int `json:"inviterUserId" db:"inviter_user_id"`
	GroupId       int `json:"groupId" db:"group_id"`
}

var groupInvitationsTable = `CREATE TABLE IF NOT EXISTS group_invitations (
		id				SERIAL	PRIMARY KEY,
		invited_user_id	INT		NOT NULL	REFERENCES users(id)	ON DELETE CASCADE,
		inviter_user_id	INT 	NOT NULL	REFERENCES users(id)	ON DELETE CASCADE,
		group_id 		INT 	NOT NULL	REFERENCES groups(id)	ON DELETE CASCADE
	)`

/////////
// NEW //
/////////

// NewGroupInvitation creates a new group invitation, but does not store it in the database
func NewGroupInvitation(invitedUserId, inviterUserId, groupId int) *GroupInvitation {
	return &GroupInvitation{ID: -1, InvitedUserId: invitedUserId, InviterUserId: inviterUserId, GroupId: groupId}
}

/////////
// GET //
/////////

// GetGroupInvitationByID returns the group invitation identified by the id
func GetGroupInvitationByID(id int) (*GroupInvitation, *utils.Cerr) {
	groupInvitations := new(GroupInvitation)
	if err := db.Get(groupInvitations, `SELECT * FROM group_invitations WHERE id=$1`, id); err != nil {
		return nil, utils.NewCerr("GI000", err)
	}
	return groupInvitations, nil
}

// GetGroupInvitationByUserId returns the group invitation sended to an user
func GetGroupInvitationsByUserId(userId int) ([]GroupInvitation, *utils.Cerr) {
	groupInvitations := []GroupInvitation{}
	query := `SELECT * FROM group_invitations WHERE invited_user_id=$1`
	if err := db.Select(&groupInvitations, query, userId); err != nil {
		return nil, utils.NewCerr("GI003", err)
	}
	return groupInvitations, nil
}

// GetGroupInvitationsByInvitedUserIdAndGroupId returns the group invitation identified by the id
func GetGroupInvitationsByInvitedUserIdAndGroupId(invitedUserId, groupId int) ([]GroupInvitation, *utils.Cerr) {
	groupInvitations := []GroupInvitation{}
	query := `SELECT * FROM group_invitations WHERE invited_user_id=$1 AND group_id=$2`
	if err := db.Select(&groupInvitations, query, invitedUserId, groupId); err != nil {
		return nil, utils.NewCerr("GI000", err)
	}
	return groupInvitations, nil
}

// GetGroupInvitationsByGroupId returns the group invitations identified by the group id
func GetGroupInvitationsByGroupId(groupId int) ([]GroupInvitation, *utils.Cerr) {
	groupInvitations := []GroupInvitation{}
	query := `SELECT * FROM group_invitations WHERE group_id=$1`
	if err := db.Select(&groupInvitations, query, groupId); err != nil {
		return nil, utils.NewCerr("GI001", err)
	}
	return groupInvitations, nil
}

//////////
// Save //
//////////

// Save stores the group in the database, creating it if the ID <= 0, updating it in the other case
func (groupInvitation *GroupInvitation) Save() *utils.Cerr {
	var err error
	if cerr := groupInvitation.validate(); cerr != nil {
		return cerr
	}

	if groupInvitation.ID < 0 { // Create
		if cerr := groupInvitation.checkBeforeCreating(); cerr != nil {
			return cerr
		}
		query := `INSERT INTO group_invitations (invited_user_id, inviter_user_id, group_id) VALUES($1, $2, $3) RETURNING id`
		err = db.QueryRow(query, groupInvitation.InvitedUserId, groupInvitation.InviterUserId, groupInvitation.GroupId).Scan(&groupInvitation.ID)
	} else { //Update
		query := `UPDATE group_invitations SET invited_user_id=:invited_user_id, inviter_user_id=:inviter_user_id, group_id=:group_id WHERE id=:id`
		var res sql.Result
		res, err = db.NamedExec(query, &groupInvitation)
		if err == nil {
			if rowsAffected, _ := res.RowsAffected(); err == nil && rowsAffected < 1 {
				err = errors.New("no rows affected")
			}
		}
	}

	if err != nil {
		return utils.NewCerr("GE000", err)
	}

	return nil
}

////////////
// Delete //
////////////

// Delete deletes the group from the database
func (groupInvitation *GroupInvitation) Delete() *utils.Cerr {
	query := `DELETE FROM group_invitations WHERE id=:id`
	res, err := db.NamedExec(query, &groupInvitation)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("GI000", errors.New("no rows affected"))
	}

	return nil
}

/////////////
// METHODS //
/////////////

func (groupInvitation *GroupInvitation) validate() *utils.Cerr {
	// Not null
	if groupInvitation.ID == 0 || groupInvitation.InvitedUserId == 0 || groupInvitation.InviterUserId == 0 || groupInvitation.GroupId == 0 {
		return utils.NewCerr("GE003", nil)
	}

	return nil
}

func (groupInvitation *GroupInvitation) checkBeforeCreating() *utils.Cerr {
	groupInvitations, cerr := GetGroupInvitationsByInvitedUserIdAndGroupId(groupInvitation.InvitedUserId, groupInvitation.GroupId)
	if cerr != nil || len(groupInvitations) > 0 {
		return utils.NewCerr("GI002", nil)
	}

	groupUsers, cerr := GetUsersByGroupId(groupInvitation.GroupId)
	if cerr != nil {
		return utils.NewCerr("GI002", nil)
	}
	for _, user := range groupUsers {
		if user.ID == groupInvitation.InvitedUserId {
			return utils.NewCerr("GI004", errors.New("this users already belongs to the group"))
		}
	}

	return nil
}
