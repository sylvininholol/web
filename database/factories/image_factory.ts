import { ProductFactory } from '#database/factories/product_factory'
import Image from '#models/Image'
import factory from '@adonisjs/lucid/factories'

export const ImageFactory = factory
  .define(Image, async () => ({
    imageUrl:
      'https://www.donacereja.com.br/media/catalog/product/cache/1/image/500x500/9df78eab33525d08d6e5fb8d27136e95/i/m/imagem_azul.png',
  }))
  .relation('products', () => ProductFactory)
  .build()
