// Package models contains table creation functions and their types
package models

import "database/sql"

// Conversation is a struct defining type for the table conversation
type Conversation struct {
	ID     string `json:"id"`
	UserId string `json:"userId"`
	Name   string `json:"name"`
}

// CreateConversationTable is a function to create conversation table
func CreateConversationTable(db *sql.DB) error {
	CreateConversationTableQueryString := `CREATE TABLE IF NOT EXISTS conversations (
		id TEXT PRIMARY KEY, 
		userId TEXT, 
		name TEXT)`
	_, err := db.Exec(CreateConversationTableQueryString)
	if err != nil {
		return err
	}

	return nil
}
