import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import user from "../models/user.model.js";
import organization from "../models/organization.model.js";
import orgmember from "../models/orgmember.model.js";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({
            message: "Email and password are required"
          });
        }

        const alreadyPresent = await user.findOne({ email });
        if (alreadyPresent) {
          return res.status(400).json({
            message: "User already exists"
          });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
          email,
          passwordHash: hashpassword
        });

        const newOrg = await organization.create({
          name: `${email}'s Organization`
        });

        await orgmember.create({
          userId: newUser._id,
          orgId: newOrg._id,
          role: "OWNER"
        });

        res.status(201).json({
          message: "User registered successfully"
        });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Internal server error"
        });
      }
    res.send("Register controller reached");
  };
  