package models

import "database/sql"

// User is a struct defining type for the table user
type User struct {
	ID        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

// CreateUserTable is a function to create message table
func CreateUserTable(db *sql.DB) error {
	var CreateUserTableQueryString string = `CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY, 
		firstName TEXT, 
		lastName TEXT, 
		email TEXT, 
		password TEXT)`
	_, err := db.Exec(CreateUserTableQueryString)
	if err != nil {
		return err
	}

	return nil
}
