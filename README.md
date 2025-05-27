# api-blood-donation

## install dependencies
`npm install` or `npm i express mongoose bcryptjs jsonwebtoken dotenv cors`

## how to run the API
### Option 1
`npm start`

### Option 2
`node server.js`

## API Routes
🔒 the routes that has this emoji means that requires to be logged in to be used { 'Authorization': Bearer AccessToken } header
<br><img src="imagesforreadme/img_6.png"  width="350"/><br>
### Authentication
| Purpose                | Method | Route                          | Consumes                                                                                                                                                     | Returns                                                      |
|------------------------|--------|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| Register               | POST   | `/api/auth/register`           | if it's a person:<br><img src="imagesforreadme/img.png"  width="250"/><br>if it's an institution:<br><img src="imagesforreadme/img_2.png"  width="250"/><br> | <img src="imagesforreadme/img_1.png"  width="300"/><br>      |
| Login                  | POST   | `/api/auth/login`              | with email:<br><img src="imagesforreadme/img_3.png"  width="250"/><br>with username:<br><img src="imagesforreadme/img_5.png"  width="250"/>                  | <img src="imagesforreadme/img_4.png"  width="300"/>          |
| Logout 🔒              | POST   | `/api/auth/logout`             | Nothing                                                                                                                                                      | { "message": "Logout successful" }                           |
| Get a new access token | POST   | `/api/auth/token/access-token` | <br><img src="imagesforreadme/img_9.png"  width="280"/><br>                                                                                                  | <br><img src="imagesforreadme/img_10.png"  width="300"/><br> | 

### Account
| Purpose                  | Method | Route             | Consumes                                                                  | Returns                                                       |
|--------------------------|--------|-------------------|---------------------------------------------------------------------------|---------------------------------------------------------------|
| Get data from account 🔒 | GET    | `/api/account/me` | Nothing                                                                   | <img src="imagesforreadme/img_20.png"  width="220"/>          |
| Edit account 🔒          | PUT    | `api/account/me`  | Fields to update <br><img src="imagesforreadme/img_21.png"  width="150"/> | <img src="imagesforreadme/img_22.png"  width="300"/>          |
| Delete account 🔒        | DELETE | `/api/account/me` | Nothing                                                                   | { "message": "Account and linked data deleted successfully" } | 

### Donor
| Purpose            | Method | Route                | Consumes                                                    | Returns                                              |
|--------------------|--------|----------------------|-------------------------------------------------------------|------------------------------------------------------|
| Become a donor 🔒  | POST   | `/api/donors/`       | <br><img src="imagesforreadme/img_7.png"  width="300"/><br> | <img src="imagesforreadme/img_8.png"  width="350"/>  |
| Search donors * 🔒 | GET    | `/api/donors/search` | Nothing                                                     | <img src="imagesforreadme/img_17.png"  width="250"/> |
* Search donor looking can be filtered. <br><img src="imagesforreadme/img_18.png"  width="300"/><br>

### Blood request
| Purpose                          | Method | Route                                        | Consumes                                                                   | Returns                                              |
|----------------------------------|--------|----------------------------------------------|----------------------------------------------------------------------------|------------------------------------------------------|
| Create a blood request 🔒        | POST   | `/api/blood-requests/`                       | <img src="imagesforreadme/img_11.png"  width="300"/>                       | <img src="imagesforreadme/img_12.png"  width="300"/> |
| Get all the blood requests 🔒    | GET    | `/api/blood-requests/`                       | Nothing                                                                    | <img src="imagesforreadme/img_13.png"  width="300"/> |
| Get a blood request by its id 🔒 | GET    | `/api/blood-requests/:id`                    | Nothing                                                                    | <img src="imagesforreadme/img_14.png"  width="300"/> |
| Edit a blood request 🔒          | PUT    | `api/blood-requests/:id`                     | Fields to update <br> <img src="imagesforreadme/img_15.png"  width="200"/> | <img src="imagesforreadme/img_16.png"  width="300"/> |
| Delete a blood request 🔒        | DELETE | `api/blood-requests/:id`                     | Nothing                                                                    | { "message": "Blood request deleted successfully" }  | 
| Apply for a blood request 🔒     | POST   | `/api/blood-requests/application/:requestId` | Nothing                                                                    | <img src="imagesforreadme/img_23.png" width="320">   | 
| Search blood requests 🔒         | GET    | `/api/blood-requests/search`                 | Nothing                                                                    | <img src="imagesforreadme/img_24.png" width="280">   |
* Search blood requests can be filtered <br><img src="imagesforreadme/img_25.png"  width="350"/><br>

### Contact 
| Purpose                              | Method | Route                   | Consumes | Returns                            |
|--------------------------------------|--------|-------------------------|----------|------------------------------------|
| Contact a person or institution * 🔒 | GET    | `/api/contact/whatsapp` | Nothing  | { "link": "https://wa.me/number" } |
* The route uses targetId and targetType query params <br><img src="imagesforreadme/img_19.png" width="350">