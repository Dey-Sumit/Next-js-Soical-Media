import mongoose from "mongoose";

// async function dbConnect() {
//   // check if we have a connection to the database or if it's currently
//   // connecting or disconnecting (readyState 1, 2 and 3)
//   if (mongoose.connection.readyState >= 1) {
//     console.log("MIDDLEWARE : DB ALREADY CONNECTED");
//   }

//   console.log("MIDDLEWARE : DB CONNECT");
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
//   mongoose.connection.on("connected", () => {
//     console.log("connected to mongo db");
//   });
//   mongoose.connection.on("error", (err) => {
//     console.log(`db connection problem`, err);
//   });
// }

// export default dbConnect;

async function dbConnect() {
  // console.log(process.env.MONGODB_URI);

  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  //! next js has no entry file :(
  if (mongoose.connection.readyState >= 1) {
    console.log("MIDDLEWARE : DB ALREADY CONNECTED");
    return;
  }
  console.log("DB not connected, trying to connect");

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  //   mongoose.connection.on("connected", () => {
  //     console.log("connected to mongo db");
  //   });
  //   mongoose.connection.on("error", (err) => {
  //     console.log(`db connection problem`, err);
  //   });
}

export default dbConnect;
