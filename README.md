# api-blood-donation

## install dependencies
`npm install` or `npm i express mongoose bcryptjs jsonwebtoken dotenv cors`

## how to run the API
### Option 1
`npm start`

### Option 2
`node server.js`

## API Routes
🔒 the routes that has this emoji means that requires { 'Authorization': Bearer AccessToken } header
<br><img src="imagesforreadme/img_6.png"  width="350"/><br>
### Authentication
| Purpose                | Method | Route                          | Consumes                                                                                                                                                     | Returns                                                      |
|------------------------|--------|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| Register               | POST   | `/api/auth/register`           | if it's a person:<br><img src="imagesforreadme/img.png"  width="200"/><br>if it's an institution:<br><img src="imagesforreadme/img_2.png"  width="200"/><br> | <img src="imagesforreadme/img_1.png"  width="300"/><br>      |
| Login                  | POST   | `/api/auth/login`              | with email:<br><img src="imagesforreadme/img_3.png"  width="200"/><br>with username:<br><img src="imagesforreadme/img_5.png"  width="200"/>                  | <img src="imagesforreadme/img_4.png"  width="300"/>          |
| Logout 🔒              | POST   | `/api/auth/logout`             | Nothing                                                                                                                                                      | { "message": "Logout successful" }                           |
| Get a new access token | POST   | `/api/auth/token/access-token` | <br><img src="imagesforreadme/img_9.png"  width="250"/><br>                                                                                                  | <br><img src="imagesforreadme/img_10.png"  width="300"/><br> | 

### Donor
| Purpose           | Method | Route         | Consumes                                                    | Returns                                             |
|-------------------|--------|---------------|-------------------------------------------------------------|-----------------------------------------------------|
| Become a donor 🔒 | POST   | `/api/donor/` | <br><img src="imagesforreadme/img_7.png"  width="200"/><br> | <img src="imagesforreadme/img_8.png"  width="300"/> |

### Blood request
| Purpose                    | Method | Route                 | Consumes                                             | Returns                                              |
|----------------------------|--------|-----------------------|------------------------------------------------------|------------------------------------------------------|
| Create a blood request 🔒  | POST   | `/api/blood-request/` | <img src="imagesforreadme/img_11.png"  width="300"/> | <img src="imagesforreadme/img_12.png"  width="200"/> |
| Get all the blood requests | GET    | `/api/blood-request/`   | Nothing                                              | |