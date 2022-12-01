const mongoose = require("mongoose");
const User  = require("../server/models/UserModel");


const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();


chai.use(chaiHttp);

describe('/GET Users', ()=>{
   it ('it should get all users', (done)=>{
       chai.request(server)
           .get("/users")
           .end((err, res)=> {
               res.should.have.status(200);
            done();
           })
   })
});
