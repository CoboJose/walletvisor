# WalletVisor Server

> The technologies on which the server is running are:
> - Go
> - PostgreSQL
> - Heroku
> 
> You can access the server and consult the **REST Endpoints** at:
> - [Walletvisor Server](https://walletvisor.herokuapp.com/)
> - [Walletvisor Server Develop](https://walletvisor-dev.herokuapp.com/)

## How to install it

1. Install [GO (v 1.16)](https://go.dev/dl/)
2. Install [PostgreSQL (v 13)](https://www.postgresql.org/download/). The installer is recommended to autoconfigure it.
3. [pgAdmin 4](https://www.pgadmin.org/download/) is recommended for the next steps
4. Make sure the **Server** `PostgreSQL` with **Connection Host** `localhost` and **User** `postgres` exists
5. Create Databases: 
    > - **Name**: `walletvisor` | **Owner**: `postgres`
	> - **Name**: `walletvisor_test` | **Owner**: `postgres`

## How to run it

1. Make sure **PostgreSQL** is running and in the default port (5432)
2. Open a terminal at **walletvisor/wv-server**
3. `go run .`

Additionally, if you wish to compile and run it:
1. `go build .`
2. Make sure the folder **/static** and the file **.env** are next to the executable
3. Run the executable

## How to test it

1. Open a terminal at **walletvisor/wv-server**
2. `cd tests`
3. `go test`
4. `go test -v` for detailed results

Additionally, you can test the server with a program like Postman:
1. Run the application
2. Consult the **Endpoints** at [http://localhost:8000](http://localhost:8000)
3. **Base URL:** http://localhost:8000/v1
