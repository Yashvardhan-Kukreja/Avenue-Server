# Avenue - Server Side code

API documentation

## Routes Structure

**=> Base URL:**
   https://avenue-angelhack.herokuapp.com

**=> Authentication Routes:**

Doctor SignUp
- POST /authenticate/user/register : Parameters (name, email, password, contact)
- Response : {success: true, message: "Doctor registered successfully"}

Doctor Login
- POST /authenticate/user/login : Parameters (email, password)
- Response : {success: true, message: "Doctor logged in successfully", token: token}

Organisation SignUp
- POST /authenticate/organisation/register : Parameters (name, college, email, contact, password)
- Response : {success: true, message: "Organisation registered successfully"}

Organisation Login
- POST /authenticate/organisation/login : Parameters (email, password)
- Response : {success: true, message: "Organisation authenticated successfully", token: token}

**=> User Routes:**

Fetching user details
- GET /user/fetchDetails: Headers ("x-access-token": token)
- Response : {success: true, message: "User details fetched successfully", user: user}

**=> Organisation Routes:**

Fetching user details
- GET /user/fetchDetails: Headers ("x-access-token": token)
- Response : {success: true, message: "Organisation details fetched successfully", organisation: organisation}


**=> Variables:**

- token: JSON Web Token containing the user object or the organisation object in encoded form
- user: A user object containing the respective user details except _id and password
- organisation: An organisation object containing the respective organisation details except _id and password