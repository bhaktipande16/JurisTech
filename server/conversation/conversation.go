package conversation

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/wbrijesh/project/helpers"
	"github.com/wbrijesh/project/models"
)

// ConversationResponse is struct for response of conversation handler
type ConversationResponse struct {
	Success       bool                  `json:"success"`
	Conversations []models.Conversation `json:"conversations"`
	Error         error                 `json:"error"`
}

// ConversationListResponse is struct for response of conversation list handler
type ConversationListResponse struct {
	Success       bool                  `json:"success"`
	Conversations []models.Conversation `json:"conversations"`
	Error         error                 `json:"error"`
}

// CreateConversationHandler handles conversation creation
func CreateConversationHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.Write([]byte("Method not allowed"))
		return
	}

	var conversation models.Conversation
	err := json.NewDecoder(r.Body).Decode(&conversation)
	if err != nil {
		w.Write([]byte("Error while decoding JSON body"))
		return
	}

	if conversation.UserId == "" || conversation.Name == "" {
		w.Write([]byte("User id or name cannot be empty"))
		return
	}

	responseConversation, err := CreateConversation(db, conversation)
	if err != nil {
		response := ConversationResponse{false, []models.Conversation{}, err}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
	}

	response := ConversationResponse{true, []models.Conversation{responseConversation}, err}
	jsonData, err := json.Marshal(response)
	helpers.ThrowInternalServerError(err, w)
	w.Write(jsonData)
}

// UpdateConversationHandler handles conversation update
func UpdateConversationHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.Write([]byte("Method not allowed"))
		return
	}

	var conversation models.Conversation
	err := json.NewDecoder(r.Body).Decode(&conversation)
	if err != nil {
		w.Write([]byte("Error while decoding JSON body"))
		return
	}

	conversationID := r.URL.Query().Get("id")
	if conversationID == "" {
		w.Write([]byte("Conversation id cannot be empty"))
		return
	}

	_, err = UpdateConversation(db, conversation, conversationID)
	if err != nil {
		response := ConversationResponse{false, []models.Conversation{}, err}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
	}

	response := ConversationResponse{true, []models.Conversation{conversation}, err}
	jsonData, err := json.Marshal(response)
	helpers.ThrowInternalServerError(err, w)
	w.Write(jsonData)
}

// DeleteConversationHandler handles conversation deletion
func DeleteConversationHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		w.Write([]byte("Method not allowed"))
		return
	}

	conversationID := r.URL.Query().Get("id")
	if conversationID == "" {
		w.Write([]byte("Conversation id cannot be empty"))
		return
	}

	_, err := DeleteConversation(db, conversationID)
	if err != nil {
		response := ConversationResponse{false, []models.Conversation{}, err}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
	}

	response := ConversationResponse{true, []models.Conversation{}, err}
	jsonData, err := json.Marshal(response)
	helpers.ThrowInternalServerError(err, w)
	w.Write(jsonData)
}

// GetAllConversationsOfUserHandler handles getting all conversations of a user
func GetAllConversationsOfUserHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.Write([]byte("Method not allowed"))
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		w.Write([]byte("User id cannot be empty"))
		return
	}

	conversations, err := GetAllConversationsOfUser(db, userID)
	if err != nil {
		response := ConversationListResponse{false, []models.Conversation{}, err}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
	}

	response := ConversationListResponse{true, conversations, err}
	jsonData, err := json.Marshal(response)
	helpers.ThrowInternalServerError(err, w)
	w.Write(jsonData)
}

// CreateConversation creates a conversation in the database
func CreateConversation(db *sql.DB, conversation models.Conversation) (models.Conversation, error) {
	responseConversation := models.Conversation{
		ID:     conversation.ID,
		UserId: conversation.UserId,
		Name:   conversation.Name,
	}

	CreateConversationQueryString := `INSERT INTO conversations 
	(id, userId, name) 
	VALUES (?, ?, ?)`
	_, err := db.Exec(CreateConversationQueryString, conversation.ID, conversation.UserId, conversation.Name)
	if err != nil {
		fmt.Println("Error while creating conversation")
		return responseConversation, err
	}
	fmt.Println("Conversation created successfully")
	return responseConversation, nil
}

// UpdateConversation updates a conversation in the database by getting conversation id from the URL
func UpdateConversation(db *sql.DB, conversation models.Conversation, conversationID string) (bool, error) {
	UpdateConversationQueryString := `UPDATE conversations 
	SET name = ? 
	WHERE id = ?`
	_, err := db.Exec(UpdateConversationQueryString, conversation.Name, conversationID)
	if err != nil {
		return false, err
	}

	return true, nil
}

// DeleteConversation deletes a conversation in the database by getting conversation id from the URL
func DeleteConversation(db *sql.DB, conversationID string) (bool, error) {
	GetConversationQueryString := `SELECT * FROM conversations WHERE id = ?`
	recordsWithSameID, recordsWithSameIDError := db.Query(GetConversationQueryString, conversationID)
	conversationWithIDNotFound := recordsWithSameID.Scan() == sql.ErrNoRows
	if conversationWithIDNotFound {
		return false, recordsWithSameIDError
	}

	DeleteConversationQueryString := `DELETE FROM conversations WHERE id = ?`
	_, err := db.Exec(DeleteConversationQueryString, conversationID)
	if err != nil {
		return false, err
	}

	return true, nil
}

// GetAllConversationsOfUser gets all conversations of a user from the database
func GetAllConversationsOfUser(db *sql.DB, userID string) ([]models.Conversation, error) {
	var conversations []models.Conversation
	rows, _ := db.Query("SELECT * FROM conversations WHERE userId = ?", userID)
	defer rows.Close()
	for rows.Next() {
		var conversation models.Conversation
		if err := rows.Scan(&conversation.ID, &conversation.UserId, &conversation.Name); err != nil {
			return conversations, err
		}
		conversations = append(conversations, conversation)
	}
	return conversations, nil
}
