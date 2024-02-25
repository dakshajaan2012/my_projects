import Joi from 'joi'

export const loginSchema =  Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(3).max(10).required(),
  termsAccepted: Joi.boolean().valid(true).required()
})

export const signUpSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(3).max(10).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  termsAccepted: Joi.boolean().valid(true).required()
})

