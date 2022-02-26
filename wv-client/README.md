# WalletVisor Client

> The technologies on which the client is running are:
> - Node
> - React
> - TypeScript
> - Netlify
> 
> You can access the client at:
> - [Walletvisor](https://walletvisor.netlify.app/)
> - [Walletvisor Develop](https://walletvisor-dev.netlify.app/)
>
>Additionally, you can install the app as a [PWA](https://web.dev/progressive-web-apps/) in your computer or phone

## How to install it

1. Install [Node (v 16)](https://nodejs.org/en/)
2. Open a terminal at **walletvisor/wv-client**
3. `npm install`

## How to run it

1. Make sure **walletvisor server** is running
2. Open a terminal at **walletvisor/wv-client**
3. `npm start`

Additionally, if you wish to build and run it:
1. `npm install -g serve`
2. `npm run build`
3. `cd build`
4. `serve -s build`

## How to test it

1. Open a terminal at **wv-client**
2. `./node_modules/.bin/cypress run` to run the test in headless mode
3. `./node_modules/.bin/cypress open` to run the test visually in a browser