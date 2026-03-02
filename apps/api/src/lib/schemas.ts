export const idParam = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", minLength: 1 },
  },
} as const

export const productIdParam = {
  type: "object",
  required: ["productId"],
  properties: {
    productId: { type: "string", minLength: 1 },
  },
} as const

export const productFilterQuery = {
  type: "object",
  properties: {
    game:      { type: "string", enum: ["Pokemon", "YuGiOh", "Magic", ""] },
    rarity:    { type: "string", maxLength: 50 },
    condition: { type: "string", enum: ["NM", "LP", "MP", "HP", ""] },
    search:    { type: "string", maxLength: 100 },
    sort:      { type: "string", enum: ["name-asc", "name-desc", "price-asc", "price-desc", ""] },
    page:      { type: "string", pattern: "^[1-9][0-9]*$" },
    limit:     { type: "string", pattern: "^([1-9]|[1-9][0-9]|100)$" },
  },
} as const

export const addressFields = {
  type: "object",
  properties: {
    label:   { type: "string", minLength: 1, maxLength: 50  },
    street:  { type: "string", minLength: 1, maxLength: 200 },
    city:    { type: "string", minLength: 1, maxLength: 100 },
    state:   { type: "string", minLength: 1, maxLength: 100 },
    zip:     { type: "string", minLength: 1, maxLength: 20  },
    country: { type: "string", minLength: 2, maxLength: 2   },
  },
} as const