import Joi from 'joi';

export const itemSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  quantity: Joi.number().integer().min(1).required(),
  original_price: Joi.number().greater(0).required(),
  new_price: Joi.number().greater(0).required(),
  expiry_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
})
  .custom((value, helpers) => {
    if (value.new_price >= value.original_price) {
      return helpers.error('any.custom');
    }
    return value;
  })
  .messages({
    'any.custom': 'new_price must be less than original_price',
  });

export const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
