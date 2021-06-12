package utils

import (
	"log"
	"os"
)

var (
	// InfoLog logs with the Info level
	InfoLog *log.Logger
	// WarningLog logs with the Warning level
	WarningLog *log.Logger
	// ErrorLog logs with the Error level
	ErrorLog *log.Logger
	// RequestLog logs with the Request level
	RequestLog *log.Logger
)

func init() {
	InfoLog = log.New(os.Stderr, "[INFO]: ", 64|log.Ldate|log.Ltime|log.Lshortfile)
	WarningLog = log.New(os.Stderr, "[WARNING]: ", 64|log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLog = log.New(os.Stderr, "[ERROR]: ", 64|log.Ldate|log.Ltime|log.Lshortfile)
	RequestLog = log.New(os.Stderr, "[REQUEST]: ", 64|log.Ldate|log.Ltime)
}
