@ECHO OFF
go test -coverpkg "../..." -coverprofile cover.out
::go tool cover -func cover.out
::go tool cover -html cover.out
gocover-cobertura < cover.out > coverage.xml
set CODACY_PROJECT_TOKEN=4993d6e6b495492099576b08364620eb
curl -Ls https://coverage.codacy.com/get.sh report -r coverage.xml
del cover.out
PAUSE

