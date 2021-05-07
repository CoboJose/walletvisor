@ECHO OFF
go test -coverpkg "../..." -coverprofile cover.out
::go tool cover -func cover.out
::go tool cover -html cover.out
gocover-cobertura < cover.out > coverage.xml
del cover.out
PAUSE

