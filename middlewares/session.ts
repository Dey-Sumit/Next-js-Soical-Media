import connectMongo from "connect-mongo";

import session from "express-session";
// import { NextApiRequest, NextApiResponse } from "next";
// import { NextHandler } from "next-connect";
// import { ExtendedNextApiRequest } from "../lib/types.api";

export default function sessionMiddleware(
  //!TODO set types
  req: any,
  res: any,
  next: any
) {
  //   const mongoStore = new MongoStore({
  //     client: process.env.MONGODB_URI,
  //     stringify: false,
  //   });
  const options = {
    mongoUrl: process.env.MONGODB_URI,
  };
  // console.log("inside session middlware");
  // console.log(req.body);

  return session({
    secret: "123456",
    resave: false,
    saveUninitialized: false,
    // age
    // cookie: { secure: true, maxAge: 20 * 20 * 5, httpOnly: false }, //! dont know wtf is going on here :(
    store: connectMongo.create(options),
  })(req, res, next);
}

// https://stackoverflow.com/questions/32830488/explain-requireconnect-mongosession

// https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session

// https://hoangvvo.com/blog/next-js-and-mongodb-app-1
