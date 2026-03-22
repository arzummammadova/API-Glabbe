import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.empty": "İstifadəçi adı boş ola bilməz",
        "string.min": "İstifadəçi adı ən az {#limit} simvoldan ibarət olmalıdır",
        "any.required": "İstifadəçi adı vacibdir"
    }),
    firstName: Joi.string().max(30).allow("", null),
    lastName: Joi.string().max(30).allow("", null),
    email: Joi.string().email().required().messages({
        "string.email": "Düzgün email ünvanı daxil edin",
        "string.empty": "Email boş ola bilməz",
        "any.required": "Email vacibdir"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Şifrə ən az {#limit} simvoldan ibarət olmalıdır",
        "any.required": "Şifrə vacibdir"
    }),
    phone: Joi.string().required().messages({
        "any.required": "Telefon nömrəsi vacibdir"
    }),
    businessType: Joi.string().valid(
        "business", "doctor", "lawyer", "accountant", "nail salon", 
        "hair salon", "spa", "beauty salon", "massage", "barber", 
        "tattoo", "piercing", "other"
    ).default("other"),
    userURL: Joi.string().allow("", null)
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Düzgün email ünvanı daxil edin",
        "any.required": "Email vacibdir"
    }),
    password: Joi.string().required().messages({
        "any.required": "Şifrə vacibdir"
    })
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Düzgün email ünvanı daxil edin",
        "any.required": "Email vacibdir"
    })
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
        "string.min": "Şifrə ən az {#limit} simvoldan ibarət olmalıdır",
        "any.required": "Şifrə vacibdir"
    })
});

export const updateMeSchema = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    firstName: Joi.string().max(30).allow("", null),
    lastName: Joi.string().max(30).allow("", null),
    phone: Joi.string().optional(),
    businessType: Joi.string().valid(
        "business", "doctor", "lawyer", "accountant", "nail salon", 
        "hair salon", "spa", "beauty salon", "massage", "barber", 
        "tattoo", "piercing", "other"
    ).optional(),
    bio: Joi.string().max(500).allow("", null),
    duration: Joi.number().optional().allow(null),
    price: Joi.number().optional().allow(null),
    userURL: Joi.string().allow("", null),
    services: Joi.array().items(
        Joi.object({
            _id: Joi.string().optional(),
            name: Joi.string().optional(),
            price: Joi.number().optional()
        })
    ).optional()
});
