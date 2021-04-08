import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export default function uploadMulter(): multer.Multer {
  // cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "/tmp");
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.filename}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  // validation
  const checkFileType = (
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const fileTypes = /jpg|jpeg|png/;

    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Images Only"));
    }
  };
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  });
}

// export default function fileUpload(filename: string) {
//   return async (
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse,
//     next: NextHandler
//   ) => {
//     console.log("here");

//     // do the validation here :)
//     if (["POST", "PUT"].includes(req.method)) {
//       try {
//         upload.single(filename);
//         console.log("uploaded");
//         console.log(req.file, req.body);
//       } catch (error) {
//         return res.status(400).json({ message: error.errors });
//       }
//     }

//     next();
//   };
// }
