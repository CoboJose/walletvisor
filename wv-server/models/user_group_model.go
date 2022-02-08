package models

import (
	"errors"
	"wv-server/utils"
)

// UserGroup join users and groups
type UserGroup struct {
	UserId  int `json:"userId" db:"user_id"`
	GroupId int `json:"groupId" db:"group_id"`
}

var userGroupsTable = `CREATE TABLE IF NOT EXISTS user_groups (
		user_id 	INT 	NOT NULL 	REFERENCES users(id)	ON DELETE CASCADE,
		group_id 	INT		NOT NULL 	REFERENCES groups(id)	ON DELETE CASCADE,
		PRIMARY KEY (user_id, group_id)
	)`

/////////
// NEW //
/////////

// NewUserGroup creates a new userGroup, but does not store it in the database
func NewUserGroup(userId, groupId int) *UserGroup {
	return &UserGroup{UserId: userId, GroupId: groupId}
}

/////////
// GET //
/////////

// GetUserGroupByID returns the userGroup identified by the id
func GetUserGroupByID(userId, groupId int) (*UserGroup, *utils.Cerr) {
	userGroup := new(UserGroup)
	if err := db.Get(userGroup, `SELECT * FROM user_groups WHERE user_id=$1 AND group_id=$2`, userId, groupId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}
	return userGroup, nil
}

// GetUserGroupsByGroupId returns the userGroups identified by group Id
func GetUserGroupsByGroupId(groupId int) ([]UserGroup, *utils.Cerr) {
	userGroups := []UserGroup{}
	query := `SELECT * FROM user_groups WHERE group_id=$1`
	if err := db.Select(&userGroups, query, groupId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}
	return userGroups, nil
}

//////////
// Save //
//////////

// Save stores the group in the database, creating it if the ID <= 0, updating it in the other case
func (userGroup *UserGroup) Save() *utils.Cerr {
	var err error
	if cerr := userGroup.validate(); cerr != nil {
		return cerr
	}

	query := `INSERT INTO user_groups (user_id, group_id) VALUES($1, $2)`
	_, err = db.Exec(query, userGroup.UserId, userGroup.GroupId)

	if err != nil {
		return utils.NewCerr("GE000", err)
	}

	return nil
}

////////////
// Delete //
////////////

// Delete deletes the group from the database
func (userGroup *UserGroup) Delete() *utils.Cerr {
	query := `DELETE FROM user_groups WHERE user_id=:user_id AND group_id=:group_id`
	res, err := db.NamedExec(query, &userGroup)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("GE000", errors.New("no rows affected"))
	}

	return nil
}

/////////////
// METHODS //
/////////////

func (userGroup *UserGroup) validate() *utils.Cerr {
	// Not null
	if userGroup.UserId == 0 || userGroup.GroupId == 0 {
		return utils.NewCerr("GE003", nil)
	}

	return nil
}
