## Music Session Management System
```
This application provides a platform for managing music sessions, allowing both administrators and users to interact with the system based on their roles
```
## Features

## For Administrators
```
Set Admin Role: Modify user properties to designate the first admin user.
```
```
User Management:
```
```
Register new accounts.
Full management autonomy on sessions and users.
Session Management:
```
```
Create sessions.
Add music to sessions from Spotify API.
Validate music, rate, and comment on music.
Music available for all users and admins.
Music displayed in terms of popularity.
```
## For Users
```
User Management:
```
```
Register new accounts.
Management autonomy on their own account.
```
```
Session Interaction:
```
```
Access all music present in their session.
Rate and comment on music.
```

## Usage

## As Administrator
```
Register an Account:
Sign up as an admin to gain access to administrator functionalities.
Session Management:
Create sessions.
Add music from Spotify API.
Validate music, rate, and comment.
Music will be available for all users and admins.
User Management:
Manage users and their roles.
```
## As User
```
Register an Account:
Sign up as a user to access user functionalities.
Music Interaction:
Access music available in the session.
Rate and comment on music.
```
## Installation
```
Clone the repository:
```

#NodeJS simple API REST

## Launch
```
docker compose up
```

## first launch without package.json
```
docker run -it -v $PWD:/app node /bin/bash
```

## Run a bash into node container
```
docker compose exec node /bin/bash
```

## Technologies Used

Node.js
Express.js
MongoDB
Spotify API
