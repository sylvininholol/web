import vine from '@vinejs/vine'

export const addItemToCartValidator = vine.compile(
  vine.object({
    id: vine.number(),
    quantity: vine.number(),
  })
)
