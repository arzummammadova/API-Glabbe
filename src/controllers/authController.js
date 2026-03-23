import { User } from "../models/authModel.js";
import { transporter } from "../utils/mailer.js";
import crypto from "crypto";
import path from "path";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, password, email, phone, businessType } = req.body;

        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }, { phone }] 
        });
        if (existingUser) {
            return res.status(400).json({ message: "User with this username, email or phone already exists" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const isFirstUser = (await User.countDocuments()) === 0;

        const newUser = new User({
            username,
            firstName,
            lastName,
            password,
            email,
            phone,
            businessType,
            verificationToken,
            role: isFirstUser ? "admin" : "user"
        });

        await newUser.save();

        const verificationUrl = `${process.env.BASE_URL}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: `"Glabbe" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Account - Glabbe",
            html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 40px auto; color: #1a1a1a;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <img src="cid:glabbelogo" alt="Glabbe Logo" style="height: 50px; width: auto;">
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 20px;">
                        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #000;">Xoş gəlmisiniz!</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                            Salam, <strong>${firstName || username}</strong>. Biz sizin üçün ən müasir web həllər təqdim edirik. 
                            Glabbe peşəkarlar üçün universal platformadır - rezervasiyaları və müştəriləri bir yerdə idarə edin.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
                            Hesabınızı tamamlamaq üçün aşağıdakı düyməyə klikləyərək email ünvanınızı təsdiqləyin:
                        </p>
                        
                        <div style="text-align: center; margin-bottom: 32px;">
                            <a href="${verificationUrl}" style="background-color: #0277FA; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Verify Account</a>
                        </div>
                        
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 32px;">
                        
                        <p style="font-size: 13px; color: #9ca3af; line-height: 1.6;">
                            Əgər düymə işləmirsə, bu linki kopyalayıb brauzerinizə yapışdırın:<br>
                            <a href="${verificationUrl}" style="color: #0277FA; text-decoration: none; word-break: break-all;">${verificationUrl}</a>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af;">
                        <p>&copy; ${new Date().getFullYear()} Glabbe. Bütün hüquqlar qorunur.</p>
                    </div>
                </div>
            `,
            attachments: [{
                filename: 'logo.png',
                path: 'c:\\Users\\hp\\Desktop\\Glabbe\\back-end\\src\\upload\\logo.png',
                cid: 'glabbelogo'
            }]
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ 
            message: "User registered successfully. Please check your email to verify your account.",
            user: {
                username: newUser.username,
                email: newUser.email,
                isVerified: newUser.isVerified
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).send(`
                <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;">Təsdiqləmə uğursuz oldu</h1>
                    <p>Token yanlışdır və ya vaxtı bitib.</p>
                    <a href="/" style="color: #0277FA;">Ana səhifəyə qayıt</a>
                </div>
            `);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="az">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hesab Təsdiqləndi - Glabbe</title>
                <style>
                    body { font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                    .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 90%; }
                    .icon { background: #ecfdf5; color: #10b981; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 32px; }
                    h1 { font-size: 24px; color: #111827; margin: 0 0 12px; }
                    p { color: #6b7280; line-height: 1.5; margin: 0 0 32px; }
                    .btn { background: #0277FA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background 0.2s; }
                    .btn:hover { background: #0056b3; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="icon">✓</div>
                    <h1>Təbriklər!</h1>
                    <p>Hesabınız uğurla təsdiqləndi. İndi Glabbe platformasına daxil ola bilərsiniz.</p>
                    <a href="${process.env.BASE_URL}/login" class="btn">Daxil ol</a>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.log(error);
        res.status(500).send("Daxili server xətası");
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                plan: user.plan,
                subscriptionExpiration: user.subscriptionExpiration
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -verificationToken");
        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateMe = async (req, res) => {
    try {
        const { userId } = req.user;
        const updates = req.body;

        // Security: Prevent updating sensitive fields
        delete updates.email;
        delete updates.password;
        delete updates.role;
        delete updates.plan;
        delete updates.subscriptionExpiration;
        delete updates.isVerified;
        delete updates.verificationToken;
        delete updates.resetPasswordToken;
        delete updates.resetPasswordExpires;
        
        // Handle nested publicProfileSettings updates
        if (updates.publicProfileSettings) {
             Object.keys(updates.publicProfileSettings).forEach(key => {
                 updates[`publicProfileSettings.${key}`] = updates.publicProfileSettings[key];
             });
             delete updates.publicProfileSettings;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password -verificationToken");

        if (!updatedUser) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        res.status(200).json({
            message: "Profiliniz uğurla yeniləndi",
            user: updatedUser
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "İstifadəçi adı və ya telefon artıq istifadə olunur" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Bu email ilə istifadəçi tapılmadı" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"Glabbe" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset - Glabbe",
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 40px auto; color: #1a1a1a;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <img src="cid:glabbelogo" alt="Glabbe Logo" style="height: 50px;">
                    </div>
                    <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #000;">Şifrəni Yenilə</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">Siz şifrənizi sıfırlamaq üçün müraciət etmisiniz. Aşağıdakı düyməyə klikləyərək yeni şifrə təyin edə bilərsiniz:</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetUrl}" style="background-color: #0277FA; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="font-size: 14px; color: #ef4444;">Bu link 1 saat ərzində etibarlıdır.</p>
                </div>
            `,
            attachments: [{
                filename: 'logo.png',
                path: 'c:\\Users\\hp\\Desktop\\Glabbe\\back-end\\src\\upload\\logo.png',
                cid: 'glabbelogo'
            }]
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Şifrə sıfırlama linki emailinizə göndərildi" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token etibarsızdır və ya vaxtı bitib" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Şifrəniz uğurla yeniləndi. İndi daxil ola bilərsiniz." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// --- ADMIN CONTROLLERS ---

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -verificationToken");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password -verificationToken");

        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const updateUserPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { plan, period } = req.body; // period: "month", "year", "7days"

        const normalizedPlan = plan === "free" ? "adi" : plan;

        if (!["pro", "adi"].includes(normalizedPlan)) {
            return res.status(400).json({ message: "Yanlış plan tipi (Yalnız pro və ya adi/free)" });
        }

        let expirationDate = new Date();

        if (normalizedPlan === "pro") {
            if (period === "year") {
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            } else if (period === "month") {
                expirationDate.setMonth(expirationDate.getMonth() + 1);
            } else {
                expirationDate.setMonth(expirationDate.getMonth() + 1); // default 1 month
            }
        } else {
            if (period === "7days") {
                expirationDate.setDate(expirationDate.getDate() + 7);
            } else {
                expirationDate = new Date(Date.now() - 1000); // Expired if reverted to adi without specific trial
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { plan: normalizedPlan, subscriptionExpiration: expirationDate },
            { new: true }
        ).select("-password -verificationToken");

        if (!updatedUser) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        res.status(200).json({
            message: `İstifadəçi planı yeniləndi: ${normalizedPlan} (${period || 'default'})`,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        res.status(200).json({ message: "İstifadəçi uğurla silindi" });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        
        if (!user || user.publicProfileSettings?.isPublic === false) {
            return res.status(404).json({ message: "Profil tapılmadı və ya gizlidir" });
        }

        const publicData = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            businessType: user.businessType,
            userURL: user.userURL,
            publicProfileSettings: user.publicProfileSettings
        };

        if (user.publicProfileSettings?.showEmail) {
            publicData.email = user.email;
        }

        if (user.publicProfileSettings?.showPhone) {
            publicData.phone = user.phone;
        }

        if (user.publicProfileSettings?.showBio) {
            publicData.bio = user.bio;
        }

        if (user.publicProfileSettings?.showServices) {
            publicData.services = user.services;
            publicData.price = user.price;
            publicData.duration = user.duration;
        }

        res.status(200).json(publicData);
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

