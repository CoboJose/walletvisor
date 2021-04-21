package utils

import (
	"log"
	"os"
)

var (
	InfoLog    *log.Logger
	WarningLog *log.Logger
	ErrorLog   *log.Logger
	RequestLog *log.Logger
)

func init() {
	InfoLog = log.New(os.Stderr, "[INFO]: ", log.Ldate|log.Ltime|log.Lshortfile)
	WarningLog = log.New(os.Stderr, "[WARNING]: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLog = log.New(os.Stderr, "[ERROR]: ", log.Ldate|log.Ltime|log.Llongfile)
	RequestLog = log.New(os.Stderr, "[REQUEST]: ", log.Ldate|log.Ltime)
}
