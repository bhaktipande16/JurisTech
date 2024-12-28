// Package db has database connection logic
package db

import (
	"database/sql"
	"fmt"
	"os"

	// needed for libsql
	_ "github.com/libsql/libsql-client-go/libsql"
)

var dbURL string = "libsql://juristech-sqlite-wbrijesh.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTY4Mjg3NjUsImlkIjoiYWViOTllZjAtZDZmYS00M2ZhLWI4MGYtNzE4NWEzZjY2OWI1In0.NUFxFqbND3Jxxo_gEP9J7k5Ys41ZpZX_1ZE5asH9FNt7napipuxiVIJ0rpxiUKhjfbKKOdLxdmAqea9wnNlwDQ"

// GetDB function returns database connection
func GetDB() (*sql.DB, error) {
	db, err := sql.Open("libsql", dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", dbURL, err)
		os.Exit(1)
	}

	return db, nil
}
