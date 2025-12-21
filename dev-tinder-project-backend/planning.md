
# Dev Tinder API lists

we are going to write the list of all the APIs that we need in order to make our dev tinder app work - these APIs will be listed and made as per the requirements of the user that could be carried on after or before logging in the app.

All these api will be made under a seperate folder structure that will contains all the routers and then it will be connected to the main app.js file to let the entire system work more efficiently.

Most likely we are going to use the model view controller option that is most of the time used by the industry and is also very reliable and scalable so that the folder structure is very clear and could be edited at any particular moment of time.

---

### 1. Creating user / login / logout

we will create a (authRouter) for all the API under this group 
- POST /auth/signup 
- POST /auth/login
- POST /auth/logout

---

### 2. view profile / edit / change pass

we will create a (profileRouter) for all the API under this group 
- GET /profile/view
- DELETE /profile/delete
- PUT /profile/edit
- PUT /profile/updatePassword

---

### 3. accept / reject / interested / ignore

we will create a (requestRouter) for all the API under this group 
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

---

### 4. connected people / requests recieved 

we will create a (userRouter) for all the API under this group 
- GET /user/connections
- GET /user/requests
- GET /user/feed

---

