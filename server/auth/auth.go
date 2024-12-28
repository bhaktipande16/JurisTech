// Package auth has authentication logic
package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/wbrijesh/project/conversation"
	"github.com/wbrijesh/project/helpers"
	"github.com/wbrijesh/project/models"
)

// RegistrationResponse is struct for response of registration handler
type RegistrationResponse struct {
	Success bool        `json:"success"`
	User    models.User `json:"user"`
	Error   error       `json:"error"`
}

// LoginResponse is struct for response of login handler
type LoginResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	User    models.User `json:"user"`
}

type ConversationResponse struct {
	Success       bool                  `json:"success"`
	Conversations []models.Conversation `json:"conversations"`
	Error         error                 `json:"error"`
}

// UserRegistrationHandler handles user registration
func UserRegistrationHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.Write([]byte("Method not allowed"))
		return
	}

	var user models.User
	user.ID = helpers.GenerateUUID()

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.Write([]byte("Error while decoding JSON body"))
		return
	}

	if user.Email == "" || user.Password == "" || user.FirstName == "" || user.LastName == "" {
		fmt.Println("email: ", user.Email)
		fmt.Println("password: ", user.Password)
		fmt.Println("firstName: ", user.FirstName)
		fmt.Println("lastName: ", user.LastName)
		fmt.Println("id: ", user.ID)
		w.Write([]byte("Email, password, first name, or last name cannot be empty"))
		return
	}

	var users []models.User

	rows, _ := db.Query("SELECT * FROM users WHERE email = ?", user.Email)
	defer rows.Close()
	for rows.Next() {
		var userIter models.User
		if err := rows.Scan(&userIter.ID, &userIter.FirstName, &userIter.LastName, &userIter.Email, &userIter.Password); err != nil {
			return
		}
		users = append(users, userIter)
	}

	if len(users) != 0 {
		response := RegistrationResponse{false, models.User{}, err}
		fmt.Print("user with email already exists")
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
	}

	responseUser, err := CreateUser(db, user, w, r)
	if err != nil {
		response := RegistrationResponse{false, responseUser, err}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
	}

	response := RegistrationResponse{true, responseUser, err}
	jsonData, err := json.Marshal(response)
	helpers.ThrowInternalServerError(err, w)
	w.Write(jsonData)
}

// UserLoginHandler handles user login
func UserLoginHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.Write([]byte("Method not allowed"))
		return
	}

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.Write([]byte("Error while decoding JSON body"))
		return
	}

	if user.Email == "" || user.Password == "" {
		fmt.Println("email: ", user.Email)
		fmt.Println("password: ", user.Password)
		w.Write([]byte("Email and or password cannot be empty"))
		return
	}

	var usersFromDB []models.User
	rows, _ := db.Query("SELECT * FROM users WHERE email = ?", user.Email)
	defer rows.Close()
	for rows.Next() {
		var userIter models.User
		if err := rows.Scan(&userIter.ID, &userIter.FirstName, &userIter.LastName, &userIter.Email, &userIter.Password); err != nil {
			return
		}
		usersFromDB = append(usersFromDB, userIter)
	}

	if len(usersFromDB) == 0 {
		fmt.Print(len(usersFromDB))
		response := LoginResponse{false, "user with email does not exist", usersFromDB[0]}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
		return
	}

	fmt.Print(usersFromDB[0].FirstName)

	var passwordMatches bool = helpers.CheckPasswordHash(user.Password, usersFromDB[0].Password)
	if !passwordMatches {
		response := LoginResponse{false, "!passwordMatches", usersFromDB[0]}
		jsonData, err := json.Marshal(response)
		helpers.ThrowInternalServerError(err, w)
		w.Write(jsonData)
		return
	}
	response := LoginResponse{true, "", usersFromDB[0]}
	jsonData, err := json.Marshal(response)
	helpers.ThrowInternalServerError(err, w)
	w.Write(jsonData)
	return
}

// CreateUser creates a user in the database
func CreateUser(db *sql.DB, user models.User, w http.ResponseWriter, r *http.Request) (models.User, error) {
	responseUser := models.User{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Password:  "",
	}

	hashedPassword, hashedPasswordError := helpers.HashPassword(user.Password)
	if hashedPasswordError != nil {
		return responseUser, hashedPasswordError
	}
	responseUser.Password = hashedPassword

	CreateUserQueryString := `INSERT INTO users 
	(id, firstName, lastName, email, password) 
	VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(CreateUserQueryString, user.ID, user.FirstName, user.LastName, user.Email, hashedPassword)
	if err != nil {
		fmt.Println("Error while creating user")
		return responseUser, err
	}

	// create a conversation for the user
	initialConversation := models.Conversation{
		ID:     helpers.GenerateUUID(),
		UserId: user.ID,
		Name:   "Initial Conversation",
	}

	_, err = conversation.CreateConversation(db, initialConversation)
	if err != nil {
		fmt.Println("Error while creating initial conversation")
		return responseUser, err
	} else {
		fmt.Println("Initial conversation created")
	}

	return responseUser, nil
}

// UpdateUser updates a user in the database
func UpdateUser(db *sql.DB, user models.User) (bool, error) {
	hashedPassword, hashedPasswordError := helpers.HashPassword(user.Password)
	if hashedPasswordError != nil {
		return false, hashedPasswordError
	}

	UpdateUserQueryString := `UPDATE users 
	SET firstName = ?, lastName = ?, email = ?, password = ? 
	WHERE id = ?`
	_, err := db.Exec(UpdateUserQueryString, user.FirstName, user.LastName, user.Email, hashedPassword, user.ID)
	if err != nil {
		return false, err
	}

	return true, nil
}

// DeleteUser deletes a user in the database
func DeleteUser(db *sql.DB, user models.User) (bool, error) {
	GetUserQueryString := `SELECT * FROM users WHERE id = ?`
	recordsWithSameID, recordsWithSameIDError := db.Query(GetUserQueryString, user.ID)
	userWithIDNotFound := recordsWithSameID.Scan() == sql.ErrNoRows
	if userWithIDNotFound {
		return false, recordsWithSameIDError
	}

	DeleteUserQueryString := `DELETE FROM users WHERE id = ?`
	_, err := db.Exec(DeleteUserQueryString, user.ID)
	if err != nil {
		return false, err
	}

	return true, nil
}
