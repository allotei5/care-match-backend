import express from "express";
import multer from "multer";
import { storeCompany } from "../controllers/company";
import { isAdmin, isAuthenticated } from "../middlewares";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default (router: express.Router) => {
  router.post("/company", isAuthenticated, isAdmin, upload.single('image'), storeCompany);
};
