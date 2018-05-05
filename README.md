# Avenue-Server:
## AngelHack 2018

Server side code for the Avenue

## Description:

Lorem Ipsum

## Routes Structure:

=> Base URL - https://avenue-angelhack.herokuapp.com

=> Routes:

-- Authentication Routes:

    <dl>
        <dt> POST /authenticate/doctor/register -> parameters (name, email, contact, password) </dt>
        <dd> Response: {success: true, message: "Doctor registered successfully"}</dd>

        <dt> POST /authenticate/doctor/login -> parameters (email, password) </dt>
        <dd> Response: {success: true, message: "Doctor looged in successfully", doctor: <fully expanded doctor object> }
    </dl>