package models

import (
	"database/sql"
	"errors"
	"regexp"
	"wv-server/utils"
)

// Group represents a user of the application
type Group struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

var groupsTable = `CREATE TABLE IF NOT EXISTS groups (
		id			SERIAL	 		PRIMARY KEY,
		name 		VARCHAR(100)	NOT NULL,
		color		VARCHAR(250) 	NOT NULL
	)`

var groupsIndexes = `CREATE INDEX IF NOT EXISTS group_name_index ON groups (name);`

/////////
// NEW //
/////////

// NewGroup creates a new group, but does not store it in the database
func NewGroup(name, color string) *Group {
	return &Group{ID: -1, Name: name, Color: color}
}

/////////
// GET //
/////////

// GetGroupByID returns the group identified by the id
func GetGroupByID(id int) (*Group, *utils.Cerr) {
	group := new(Group)
	if err := db.Get(group, `SELECT * FROM groups WHERE id=$1`, id); err != nil {
		return nil, utils.NewCerr("GR000", err)
	}
	return group, nil
}

//////////
// Save //
//////////

// Save stores the group in the database, creating it if the ID <= 0, updating it in the other case
func (group *Group) Save() *utils.Cerr {
	var err error
	if cerr := group.validate(); cerr != nil {
		return cerr
	}

	if group.ID < 0 { // Create
		query := `INSERT INTO groups (name, color) VALUES($1, $2) RETURNING id`
		err = db.QueryRow(query, group.Name, group.Color).Scan(&group.ID)
	} else { //Update
		query := `UPDATE groups SET name=:name, color=:color WHERE id=:id`
		var res sql.Result
		res, err = db.NamedExec(query, &group)
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
func (group *Group) Delete() *utils.Cerr {
	query := `DELETE FROM groups WHERE id=:id`
	res, err := db.NamedExec(query, &group)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("GR000", errors.New("no rows affected"))
	}

	return nil
}

/////////////
// METHODS //
/////////////

func (group *Group) validate() *utils.Cerr {
	// Not null
	if group.ID == 0 || group.Name == "" || group.Color == "" {
		return utils.NewCerr("GE003", nil)
	}
	// Color
	var colorRegex = regexp.MustCompile("^#(?:[0-9a-fA-F]{3}){1,2}$")
	if !colorRegex.MatchString(group.Color) {
		return utils.NewCerr("GR001", nil)
	}

	return nil
}
