// Package main
package main

import (
	"log"
	"net/http"

	"github.com/wbrijesh/project/auth"
	"github.com/wbrijesh/project/conversation"
	"github.com/wbrijesh/project/db"
	"github.com/wbrijesh/project/helpers"
	"github.com/wbrijesh/project/models"
)

func main() {
	database, err := db.GetDB()
	if err != nil {
		log.Fatal("Error while connecting to database")
	}

	models.CreateUserTable(database)
	models.CreateConversationTable(database)
	models.CreateMessageTable(database)

	helpers.HandleAPIRoute("/api/register", auth.UserRegistrationHandler, database)
	helpers.HandleAPIRoute("/api/login", auth.UserLoginHandler, database)

	// conversation routes
	helpers.HandleAPIRoute("/api/createConversation", conversation.CreateConversationHandler, database)
	helpers.HandleAPIRoute("/api/updateConversation", conversation.UpdateConversationHandler, database)
	helpers.HandleAPIRoute("/api/deleteConversation", conversation.DeleteConversationHandler, database)
	helpers.HandleAPIRoute("/api/getAllConversations", conversation.GetAllConversationsOfUserHandler, database)

	port := "8000"
	log.Print("App running on localhost://", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
