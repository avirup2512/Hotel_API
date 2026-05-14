# Hotel_API
Aggregate overlapping hotel offers from two mock suppliers, dedupe hotels, and select the best offer per hotel. Add the ability to filter hotels by price range.
It is an Node JS and Express Application. In This Project in root folder main 2 folders are there `Hotel_API` and `Hotels_Supplier_API`.
Both Folders has their own `Controller`,`Service`,`Model`, `Route` etc. folder.

<b>Technology used in this project</b>
1) Node (Backend Language)
2) Express (Framework)
3) Temporal (For API orchestration)
4) Redis (For Caching Api response)
5) Docker (For Containerization of this whole Project)
   
<b>How start the Application</b>
1) Install Docker in your machine
2) Start Docker
3) Clone the repository
4) Go to Project (Cloned) folder.
5) Run docker compose up --build
6) In this repository `Hotels_API.postman_collection` file is there. Import that file to postman.
7) Then in postman test the APIs.
