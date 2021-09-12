
## Name

##### Palo alto task


## Description

##### In this project we are setting up a local server at port 8080,
##### and we will also implement the client side that can see in the browser -
##### the data receives from the local server.
##### The data will be stored in the local memory of the program.




## Installation

##### Install the express-node.js that the server will cen run;

open the cmd.
Go to the location where the server.js file is located
and then type...

```sh
npm init
npm install express
node server.js
```

You should see now the following line:
> Example app listening at http://localhost:8080

##### create the react-app for the client side;
open the cmd.
Go to the location where the project will be located,
and then type…

```sh
npx create-react-app my-app
cd my-app
cd src
```


in the 'src' folder -
- delete the file App.js,
- copy here the files: App.js, info.js, styles.css, icon.svg (the files from the GitHub...).

you cen also delete the files: logo.svg, App.css, App.test 


type into the index.js file the next line:
 * import './styles.css';

and then type in the cmd…

```sh
npm start
```

You should see now the in your browser the data receives from the server.

*Note*:  You can refresh the page and see the new data that received in the server

*For more information, you can contact us by email at: 00feder@gmail.com*


