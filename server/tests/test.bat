@ECHO OFF
go test -coverpkg "../..." -coverprofile cover.out
::go tool cover -func cover.out
::go tool cover -html cover.out
::gocover-cobertura < cover.out > coverage.xml

godacov -t 4993d6e6b495492099576b08364620eb -r ./cover.out -c 88ca7cc

del cover.out
PAUSE

