export type Product = {
    id: string
    name: string
    game: "Pokemon" | "YuGiOh" | "Magic"
    set: string
    rarity: string
    condition: "NM" | "LP" | "MP" | "HP"
    price: number
    imageUrl: string
    stock: number
}