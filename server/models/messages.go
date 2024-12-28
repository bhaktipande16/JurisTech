package models

import "database/sql"

// Message is a struct defining type for the table message
type Message struct {
	ID             string `json:"id"`
	ConversationId string `json:"conversationId"`
	UserId         string `json:"userId"`
	Text           string `json:"text"`
	Rank           string `json:"rank"`
	Vote           string `json:"vote"`
}

// CreateMessageTable is a function to create message table
func CreateMessageTable(db *sql.DB) error {
	CreateMessageTableQueryString := `CREATE TABLE IF NOT EXISTS messages (
		id TEXT PRIMARY KEY,
		conversationId TEXT,
		userId TEXT,
		text BLOB,
		rank TEXT,
		vote TEXT
	      )`
	_, err := db.Exec(CreateMessageTableQueryString)
	if err != nil {
		return err
	}

	return nil
}
