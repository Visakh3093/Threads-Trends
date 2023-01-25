const accountSid = "AC83665e7a2672554997f713f21c9897e6";
const authToken = "c269d892a7415ca08a1bced2eeeacfd6";
const verifySid = "ZSa498a6da1b668ea42ad15e5cd4c6a022";
const client = require("twilio")(accountSid, authToken);

const express = require('express')
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure


module.exports={
  sentotp :(number) =>{
    client.verify.v2 
  .services(verifySid)
  .verifications.create({ to: `+91 ${number} `, channel: "sms" })
 },
    check: async (otpCode,number) => {
          try{
    const status = await client.verify.v2
              .services(verifySid)
              .verificationChecks.create({ to: `+91 ${number}`, code: otpCode });
               return status
          }catch(err){
              console.log(err);
          }   
      }
    }
    