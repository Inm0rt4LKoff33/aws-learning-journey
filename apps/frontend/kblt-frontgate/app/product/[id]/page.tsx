import { notFound } from "next/navigation"
import { productsApi } from "@/app/lib/products.api"
import ProductClient from "./product-client"

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  let data
  try {
    data = await productsApi.getById(id)
  } catch {
    notFound()
  }

  const { product, availableStock, lowStock, outOfStock } = data

  return (
    <ProductClient
      product={product}
      availableStock={availableStock}
      lowStock={lowStock}
      outOfStock={outOfStock}
    />
  )
}