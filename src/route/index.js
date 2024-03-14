// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
    static #list = []
    static #count = 0;

    constructor(
      img,
      title, 
      description, 
      category, 
      price, 
      amount = 0
      ) {
       this.id = ++Product.#count,
       this.img = img,
       this.title = title,
       this.description = description,
       this.category = category,
       this.price = price,
       this.amount = amount
    }

    static add = (
      img,
      title,
      description,
      category,
      price,
      amount = 0,
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
  10,
)

Product.add (
  'https://s3-alpha-sig.figma.com/img/aede/c031/7fe5202d7ac4e7b691236d6844886fd6?Expires=1711324800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KEH0IyIxyCq6P8~cdwUZqHM0oO5dCNicp0SUDkdrIGYtCxHwP7MK7NTca4DZlqs50eFguzNj6f-uyaWA0oVQ9D6s2uHT2I9eOGdm~M8keaJgiPBdht9IE~Dw~~8L1~ZcCATNHAPZhRF3X3Bnw~yd1OSjbiHSJ0~5-z0L3w6IZx9VYHZsH3f5O8pWY3pYFSomqz0f0oq6DPtGCewTQjAOOx~mBXGIi1DvrpgNrTHuB5HEPE1iGKJcZ9ONO8DWDObvh4spOfz3y~cAEmndNhZ7ykumnM5oDceoR07ZEK4lo37Vrl0rsKIiXNpJN7kznXTN3b-DHfFfmSt~yzi~zIE5JQ__',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 2, text: 'Готовий до відправки'},
    { id: 1, text: 'Топ продажів'},
  ],
  17000,
  10,
)

Product.add (
  'https://www.figma.com/file/DNf0rpUeFTlZdQvD82DLnK/image/de873f8a57a84cf9127c35b92f7774715ae2ebb4',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 1, text: 'Готовий до відправки'},
    { id: 1, text: 'Топ продажів'},
  ],
  113109,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150;
  static #BONUS_FACTOR = 0.1

  static #count = 0;
  static #list = [];

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }
  
  constructor(data, product) {
    this.id =++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email
    this.delivery = data.delivery

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    
    this.amount = data.amount
    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)
    newPurchase.product.amount -= newPurchase.amount

    return newPurchase
  }

  static getlist = () => {
     return Purchase.#list.reverse().map((purchase) =>
     ({
        id: purchase.id,
        product: purchase.product.title,
        totalPrice: purchase.totalPrice,
        bonus:
         Purchase.calcBonusAmount(purchase.totalPrice),
     }))
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
     const purchase = Purchase.getById(id)

     if (purchase) {
       if (data.firstname)
         purchase.firstname = data.firstname
       if (data.lastname) purchase.lastname = data.lastname
       if (data.phone) purchase.phone = data.phone
       if (data.email) purchase.email = data.email
       if (data.delivery) purchase.delivery= data.delivery

       return true 
     } else {
      return false
    }
  } 
}

class Promocode {
   static #list = []

   constructor(name, factor) {
     this.name = name
     this.factor = factor
   }

   static add = (name, factor) => {
     const newPromocode = new Promocode(name, factor)
     Promocode.#list.push(newPromocode)
     return Promocode
   }

   static getByName = (name) => {
     return this.#list.find((promo) => promo.name === name)
   }

   static calc = (promo, price) => {
      return price * promo.factor
   }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

// router.get Створює нам один
// ↙️ тут вводимо шлях (PATH) до сторінки


// router.get('/purchase-create', function (req, res) {
//   res.render('purchase-create', {
//     style: 'purchase-create',
//     data: {
//        list: Product.getlist(),
//        link: '/purchase-list',
//     }
//   })
// })

// router.post('/purchase-create', function (req, res) {
//   res.render('purchase-create', {
//     style: 'purchase-create',
//     data: {
//        list: Product.getlist(),
//     }
//   })
// })

router.get('/purchase-info', function (req, res) {
  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
       list: Product.getlist(),
    }
  })
})

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    title: "Товари",
    description: `Комп'ютери та ноутбуки/Комп'ютери,неттопи,моноблоки`,
    data: {
       products: Product.getlist(),
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
      product: {
        title: "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600",
        description: "AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС",
        img: "https://s3-alpha-sig.figma.com/img/ddfa/a276/a90c0923ebff03b07b79c65f7bc2f7de?Expires=1711324800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HD2xhU8ZeXge6QH~iWmD3uNIA39Jd~w-vG9VT4QMeTTWlSLDPkzNEYbjEzbvREXu3yc7JXPKc2GbA8h0-gbmpbo9sAJptiluiMv1eXWiWvNOm4~XHNv37yUBYS0hVERSSlBcHSoQRZkTt-PTiUPxZ6naUAnSxRLX9RUuPdcl0FBkkhYZpebZMhjiaMadO2eyrfNJ7OmQs8Sz1BCXl0XDZ68YMB6YxqdQMSArCq6IptkBMVHSSdX5nfigXEWO8uGDKTASomZDygpyUkhDBxsUqBszmzWNWm4ZuOk6jjQt84QpB0pF~XrVlG7e6F6xyhjly3XgTRmL1RbVub5LmCws4w__",
      }        
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/test-path', function (req, res) {
  res.render('alert', {
      style: 'alert',
      data: {
        message: 'Успішно',
        info: 'Замовлення створено',
        link: `/test-path`
      },
    })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.query.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      component: [ 'button', 'heading'],

      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      }
    })
   }
  const product = Product.getById(id);

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      component: [ 'button', 'heading'],

      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      }
     })
   }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    component: [ 'divider', 'field', 'button', 'heading' ],
    data: {
      title: 'Ваше замовлення',
      subtitle: 'Оформлення замовлення',

      id: product.id,
      
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      amount,
      bonus,
      deliveryPrice: Purchase.DELIVERY_PRICE,
    }
  })
})

router.post('/purchase-submit', function (req, res) {
    const id = Number(req.query.id)
    let {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      email,
      phone,
      comment,
      delivery,

      promocode,
      bonus,
    } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      }
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній кількості',
        link: '/purchase-list',
    }
   })
  }
  totalPrice = Number(totalPrice),
  productPrice = Number(productPrice),
  deliveryPrice = Number(deliveryPrice),
  amount = Number(amount),
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
     isNaN(productPrice) ||
      isNaN(deliveryPrice) ||
       isNaN(amount) ||
       isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        message: 'Помилка',
        info: 'Некоректні данні',
        link: '/purchase-list',
      }
    })
  }

  if(!firstname, !lastname, !email, !phone) {
    return res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні данні',
        link: '/purchase-list',
      }
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
       bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice-=bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
       totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      bonus,
      comment,
      delivery,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    component: ['button', 'heading'],

    data: {
      message: `Успішно`,
      info: 'Замовлення створено',
      link: '/purchase-list',
    }
  })
})

router.get('/purchase-list', function (req, res) {
  const list = Purchase.getlist()
  console.log('purchase-list:', list)

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      purchases: {
        list,
      },
    },
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
