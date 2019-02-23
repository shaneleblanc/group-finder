
### Summary
A social online game tool for finding groups of other players to play with. 
### TO DO
#### Back-end
- [X] React Router

- [ ] Email support for registration (Nodemailer)
- [X] Sign Up / Authentication (react-modal-login)
- [X] Cookie support (universal-cookie)
- [X] Database Storage (MongoDB Atlas)
- [X] Back-end  API (StrongLoop)
- [ ] Caching list data (Redis)
- [ ] Add new character to list
- [ ] List Characters Component
- [ ] List Parties Component
    - [ ] React Table Viewing Component
- [ ] View List Sorting/Filtering Functions
- [ ] Open to join or Request to join Party option
- [ ] Party leader kick members function
- [ ] Links Bar 
- [ ] Index Page - About and default list view 
- [ ] Edit User Profile
- [ ] Time zone setting
#### Front-end 
- [X] Base Layout and CSS scheme 
- [ ] Links Bar
- [ ] Class Images
- [ ] Edit User Profile Modal 
- [ ] Multiple characters support 

#### Data schema
Denormalized NoSQL database - Design by queries to be ran

Queries needed:
- User login, profile update 
- List groups, find() by column (dropdown box option), limit() 10-20 by default
- List characters, find() by columns (dropdown box option), limit() 10-20 by default
- Add a character 
- Create a group
- Join a group
- Create request to join group
- Remove from group

Collections: 
- User
  - Login info
  - Email 
  - Characters
    - Class
    - Realm
    - League
    - Potentially character info (level, skill, etc.) via GGG or poe.ninja API 
- Groups
  - Party leader
  - Content type
  - Times played
  - Characters in group (redundant data copied from user)
  -                                     
