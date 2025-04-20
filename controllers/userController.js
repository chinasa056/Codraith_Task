const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const sendMail = require("../middleware/nodemailer")
const jwt = require("jsonwebtoken");
const { signUpTemplate } = require("../utils/mailTemplate");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExists = await userModel.findOne({ email: email.toLowerCase() })

        if (userExists) {
            return res.status(400).json({
                message: `User with email ${email} already exists`
            })
        };
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        })

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // configure the link to verify the user
        const link = `${req.protocol}://${req.get("host")}/api/v1/user/verify/${token}`
        const firstName = user.fullName.split(" ")[1]
        const html = signUpTemplate(link, firstName)

        // send the user a mail
        const mailOptions = {
            subject: "Welcoming Email",
            email: user.email,
            html
        }
        // await the nodemaileer to send the email to the user
        await sendMail(mailOptions);

        await user.save()

        res.status(201).json({
            message: "Account registered successfully, please check your email to verify",
            data: user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error registering User",
            error: error.message
        })
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                message: "Token not found"
            })
        };

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({
                message: "Account not found"
            })
        };

        user.isVerified = true;
        await user.save()

        res.status(200).json({
            message: "Account verified successfully"
        })

    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(500).json({
                message: "Verification link expired"
            })
        }
        res.status(500).json({
            message: "Error verifying account"
        })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === null) {
            return res.status(400).json({
                message: "Please enter your email address"
            })
        };

        if (password === null) {
            return res.status(400).json({
                message: "Please enter your password"
            })
        };

        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "Incorrect Credentials"
            })
        };

        const correctPassword = await bcrypt.compare(password, userExists.password);
        if (!correctPassword) {
            return res.status(400).json({
                message: "Incorrect Credentials"
            })
        };

        if (user.isVerified === false) {
            return res.status(400).json({
                message: "Your account is not verified, please check your email to verify"
            })
        };

        // generate a token for the user
        const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, { expiresIn: "1day" });

        res.status(200).json({
            message: "Login successful",
            data: user.name,
            token
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error logging in User",
            error: error.message
        })
    }
};
