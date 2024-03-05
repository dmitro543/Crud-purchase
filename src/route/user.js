// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
    static #list = []
    static #count = 0;

    constructor(img, title, description, category, price) {
       this.id = ++Product.#count,
       this.img = img,
       this.title = title,
       this.description = description,
       this.category = category,
       this.price = price
    }

    static add = (
      img,
      title,
      description,
      category,
      price,
    ) => {
      const newProduct = new Product (
         img,
       title,
       description,
       category,
       price,
      )

      this.#list.push(newProduct);
    }

    static getlist = () => {
      return this.#list
    }

    static getById = (id) => {
      return this.#list.find((product) => product.id === id);
    }

    static getRandomList = (id) => {
      const filteredList = this.#list.filter(
        (product) => product.id !== id,
      )

      const shuffledList = filteredList.sort (
        () => Math.random() - 0.5,
      )

      return shuffledList.slice(0, 3)
    }
}

Product.add (
  'https://www.figma.com/file/DNf0rpUeFTlZdQvD82DLnK/image/de873f8a57a84cf9127c35b92f7774715ae2ebb4',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 2, text: 'Готовий до відправки'},
    { id: 1, text: 'Топ продажів'}
  ],
  27000,
)

Product.add (
  'https://www.figma.com/file/DNf0rpUeFTlZdQvD82DLnK/image/de873f8a57a84cf9127c35b92f7774715ae2ebb4',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [{ id: 1, text: 'Топ продажів'}],
  17000,
)

Product.add (
  'https://www.figma.com/file/DNf0rpUeFTlZdQvD82DLnK/image/de873f8a57a84cf9127c35b92f7774715ae2ebb4',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [{ id: 1, text: 'Готовий до відправки'}],
  113109,
)

// ================================================================

// router.get Створює нам один
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
       message: 'Операція успішна',
       info: 'Товар створений',
       link: '/test-path',
       img: 'https://www.figma.com/file/DNf0rpUeFTlZdQvD82DLnK/image/de873f8a57a84cf9127c35b92f7774715ae2ebb4',
       title: "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
       description: 'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
       category: 'Готовий до відправки',
       price: '27 000₴',
       list: Product.getlist(),
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      message: 'Операція успішна',
       info: 'Товар створений',
       link: '/test-path',
       img: 'https://www.figma.com/file/DNf0rpUeFTlZdQvD82DLnK/image/de873f8a57a84cf9127c35b92f7774715ae2ebb4',
       title: "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
       description: 'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
       category: 'Готовий до відправки',
       price: '27 000₴',
      list: Product.getRandomList(id),
      product: Product.getById(id),
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-create', function (req, res) {
    const id = Number(req.query.id)
    const amount = Number(req.query.amount)
  
    console.log(id, amount)
    // res.render генерує нам HTML сторінку
  
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('purchase-product', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-product',
      data: {
        list: Product.getRandomList(id),
        product: Product.getById(id),
      }
    })
    // ↑↑ сюди вводимо JSON дані
})