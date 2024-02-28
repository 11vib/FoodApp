import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import session from "express-session";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import User from "../FoodApp/model/userModel.js";
import foodRoutes from "../FoodApp/routes/foodRoutes.js";
import orderRoutes from "../FoodApp/routes/orderRoutes.js";

dotenv.config();
const cache = new NodeCache();
const app = express();
const port = process.env.PORT;
mongoose.connect(process.env.MONGO);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/secrets", async function (req, res) {
  let foundUsers = await User.find({ secret: { $ne: null } });
  if (foundUsers) {
    console.log(foundUsers);
    res.render("secrets.ejs", { usersWithSecrets: foundUsers });
  }
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.redirect("/login");
    } else {
      const hash = bcrypt.hash(password, process.env.SALTROUNDS);
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: hash,
        role,
      });
      await newUser.save();
      req.login(newUser, (err) => {
        if (err) {
          console.error("Error during login:", err);
        } else {
          res.redirect("/secrets");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/submit", function (req, res) {
  console.log(req.user, "submitUser");
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", async function (req, res) {
  if (req.isAuthenticated()) {
    console.log(req.body);
    console.log(req.user, "user");
    console.log(req.body.secret, "secret");

    try {
      if (req.body && req.body.secret) {
        let updatedUser = await User.findOneAndUpdate(
          { googleId: req.user.googleId },
          { $set: { feedback: req.body.secret } },
          { new: true }
        );
        console.log(updatedUser, "updatedUser");
        res.send("feedback updated");
      } else {
        res
          .status(400)
          .json({ error: "Bad Request. Missing secret in request body." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

passport.use(
  "local",
  new Strategy(async function verify(email, password, cb) {
    try {
      const user = await User.findOne({ email: email });

      if (user) {
        const storedHashedPassword = user.password;
        const valid = bcrypt.compare(password, storedHashedPassword);

        if (valid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err, "local error");
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3500/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(accessToken);
        console.log(profile);
        const user = await User.findOne({ email: profile.email });

        if (!user) {
          const newUser = new User({
            email: profile.email,
            googleId: profile.id,
          });
          await newUser.save();
          return cb(null, newUser);
        } else {
          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
