// Package helpers contains high level functions that are used in main.go
package helpers

import (
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// GenerateUUID generates a new UUID using google's uuid package
func GenerateUUID() string {
	return uuid.New().String()
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	return string(hash), err
}

// CheckPasswordHash checks a password against a hash using bcrypt
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	fmt.Print("password is " + password)
	hashedPassword, _ := HashPassword(password)
	fmt.Print("passed hash is " + hashedPassword)
	fmt.Print("correct hash is " + hash)
	return err == nil
}
