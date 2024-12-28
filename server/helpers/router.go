package helpers

import (
	"database/sql"
	"net/http"
)

// HandleCors allows requests from any origin
func HandleCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
	(*w).Header().Set("Content-Type", "application/json")
}

// ThrowInternalServerError throws an internal server error if the error is not nil
func ThrowInternalServerError(err error, w http.ResponseWriter) {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// HandleAPIRoute is a wrapper function for API routes
func HandleAPIRoute(path string, handler func(*sql.DB, http.ResponseWriter, *http.Request), database *sql.DB) {
	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		HandleCors(&w)
		handler(database, w, r)
	})
}
