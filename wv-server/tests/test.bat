@ECHO OFF
go test -coverpkg "../..." -coverprofile cover.out
go tool cover -func cover.out
::go tool cover -html cover.out
del cover.out
PAUSE

