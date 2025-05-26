
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS product_type (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL UNIQUE,
    coefficient REAL    NOT NULL
);


CREATE TABLE IF NOT EXISTS material_type (
    id              INTEGER PRIMARY KEY,
    name            TEXT    NOT NULL UNIQUE,
    defect_percent  REAL    NOT NULL    
);


CREATE TABLE IF NOT EXISTS partner_type (
    id    INTEGER PRIMARY KEY,
    name  TEXT    NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS product (
    id                  INTEGER PRIMARY KEY,
    sku                 TEXT    NOT NULL UNIQUE,
    name                TEXT    NOT NULL,
    product_type_id     INTEGER NOT NULL
                           REFERENCES product_type(id)
                           ON UPDATE CASCADE
                           ON DELETE RESTRICT,
    min_price_partner   REAL
);


CREATE TABLE IF NOT EXISTS partner (
    id                  INTEGER PRIMARY KEY,
    type_id             INTEGER NOT NULL
                           REFERENCES partner_type(id)
                           ON UPDATE CASCADE
                           ON DELETE RESTRICT,
    company_name        TEXT    NOT NULL,
    legal_address       TEXT,
    inn                 TEXT    UNIQUE,
    director_fullname   TEXT,
    phone               TEXT,
    email               TEXT,
    logo                BLOB,
    rating              REAL    DEFAULT 0,
    sales_channels      TEXT
);


CREATE TABLE IF NOT EXISTS partner_sales (
    id            INTEGER PRIMARY KEY,
    partner_id    INTEGER NOT NULL
                     REFERENCES partner(id)
                     ON UPDATE CASCADE
                     ON DELETE CASCADE,
    product_id    INTEGER NOT NULL
                     REFERENCES product(id)
                     ON UPDATE CASCADE
                     ON DELETE RESTRICT,
    sale_date     DATE    NOT NULL,
    quantity      INTEGER NOT NULL,
    revenue       NUMERIC NOT NULL
);


CREATE INDEX IF NOT EXISTS idx_product_type_name    ON product_type(name);
CREATE INDEX IF NOT EXISTS idx_material_type_name   ON material_type(name);
CREATE INDEX IF NOT EXISTS idx_partner_type_name    ON partner_type(name);
CREATE INDEX IF NOT EXISTS idx_product_sku          ON product(sku);
CREATE INDEX IF NOT EXISTS idx_partner_inn          ON partner(inn);
CREATE INDEX IF NOT EXISTS idx_sales_partner_date   ON partner_sales(partner_id, sale_date);


INSERT OR IGNORE INTO product_type (name, coefficient) VALUES
    ('Ламинат',            2.35),
    ('Массивная доска',    5.15),
    ('Паркетная доска',    4.34),
    ('Пробковое покрытие', 1.50);

INSERT OR IGNORE INTO product (sku, name, product_type_id, min_price_partner) VALUES
    ('8758385', 'Паркетная доска Ясень темный однополосная 14 мм',
        (SELECT id FROM product_type WHERE name = 'Паркетная доска'),
        4456.90),
    ('8858958', 'Инженерная доска Дуб Французская елка однополосная 12 мм',
        (SELECT id FROM product_type WHERE name = 'Паркетная доска'),
        7330.99),
    ('7750282', 'Ламинат Дуб дымчато-белый 33 класс 12 мм',
        (SELECT id FROM product_type WHERE name = 'Ламинат'),
        1799.33),
    ('7028748', 'Ламинат Дуб серый 32 класс 8 мм с фаской',
        (SELECT id FROM product_type WHERE name = 'Ламинат'),
        3890.41),
    ('5012543', 'Пробковое напольное клеевое покрытие 32 класс 4 мм',
        (SELECT id FROM product_type WHERE name = 'Пробковое покрытие'),
        5450.59);

INSERT OR IGNORE INTO material_type (name, defect_percent) VALUES
    ('Тип материала 1', 0.0010),  
    ('Тип материала 2', 0.0095),  
    ('Тип материала 3', 0.0028),  
    ('Тип материала 4', 0.0055),  
    ('Тип материала 5', 0.0034);  


INSERT OR IGNORE INTO partner_type (name) VALUES
    ('ЗАО'),
    ('ООО'),
    ('ПАО'),
    ('ОАО');

INSERT OR IGNORE INTO partner (
    type_id, company_name, director_fullname, email, phone, legal_address, inn, rating
) VALUES
    (
      (SELECT id FROM partner_type WHERE name = 'ЗАО'),
      'База Строитель',
      'Иванова Александра Ивановна',
      'aleksandraivanova@ml.ru',
      '493 123 45 67',
      '652050, Кемеровская область, город Юрга, ул. Лесная, 15',
      '2222455179',
      7
    ),
    (
      (SELECT id FROM partner_type WHERE name = 'ООО'),
      'Паркет 29',
      'Петров Василий Петрович',
      'vppetrov@vl.ru',
      '987 123 56 78',
      '164500, Архангельская область, город Северодвинск, ул. Строителей, 18',
      '3333888520',
      7
    ),
    (
      (SELECT id FROM partner_type WHERE name = 'ПАО'),
      'Стройсервис',
      'Соловьев Андрей Николаевич',
      'ansolovev@st.ru',
      '812 223 32 00',
      '188910, Ленинградская область, город Приморск, ул. Парковая, 21',
      '4440391035',
      7
    ),
    (
      (SELECT id FROM partner_type WHERE name = 'ОАО'),
      'Ремонт и отделка',
      'Воробьева Екатерина Валерьевна',
      'ekaterina.vorobeva@ml.ru',
      '444 222 33 11',
      '143960, Московская область, город Реутов, ул. Свободы, 51',
      '1111520857',
      5
    ),
    (
      (SELECT id FROM partner_type WHERE name = 'ЗАО'),
      'МонтажПро',
      'Степанов Степан Сергеевич',
      'stepanov@stepan.ru',
      '912 888 33 33',
      '309500, Белгородская область, город Старый Оскол, ул. Рабочая, 122',
      '5552431140',
      10
    );

INSERT INTO partner_sales (partner_id, product_id, sale_date, quantity, revenue)
VALUES
    ((SELECT id FROM partner WHERE company_name='База Строитель'),
     (SELECT id FROM product WHERE name='Паркетная доска Ясень темный однополосная 14 мм'),
     '2023-03-23', 15500,
     15500 * (SELECT min_price_partner FROM product WHERE sku='8758385')
    ),
    ((SELECT id FROM partner WHERE company_name='База Строитель'),
     (SELECT id FROM product WHERE name='Ламинат Дуб дымчато-белый 33 класс 12 мм'),
     '2023-12-18', 12350,
     12350 * (SELECT min_price_partner FROM product WHERE sku='7750282')
    ),
    ((SELECT id FROM partner WHERE company_name='База Строитель'),
     (SELECT id FROM product WHERE name='Ламинат Дуб серый 32 класс 8 мм с фаской'),
     '2024-06-07', 37400,
     37400 * (SELECT min_price_partner FROM product WHERE sku='7028748')
    ),
    ((SELECT id FROM partner WHERE company_name='Паркет 29'),
     (SELECT id FROM product WHERE name='Инженерная доска Дуб Французская елка однополосная 12 мм'),
     '2022-12-02', 35000,
     35000 * (SELECT min_price_partner FROM product WHERE sku='8858958')
    ),
    ((SELECT id FROM partner WHERE company_name='Паркет 29'),
     (SELECT id FROM product WHERE name='Пробковое напольное клеевое покрытие 32 класс 4 мм'),
     '2023-05-17', 1250,
     1250 * (SELECT min_price_partner FROM product WHERE sku='5012543')
    ),
    ((SELECT id FROM partner WHERE company_name='Паркет 29'),
     (SELECT id FROM product WHERE name='Ламинат Дуб дымчато-белый 33 класс 12 мм'),
     '2024-06-07', 1000,
     1000 * (SELECT min_price_partner FROM product WHERE sku='7750282')
    ),
    ((SELECT id FROM partner WHERE company_name='Паркет 29'),
     (SELECT id FROM product WHERE name='Паркетная доска Ясень темный однополосная 14 мм'),
     '2024-07-01', 7550,
     7550 * (SELECT min_price_partner FROM product WHERE sku='8758385')
    ),
    ((SELECT id FROM partner WHERE company_name='Стройсервис'),
     (SELECT id FROM product WHERE name='Паркетная доска Ясень темный однополосная 14 мм'),
     '2023-01-22', 7250,
     7250 * (SELECT min_price_partner FROM product WHERE sku='8758385')
    ),
    ((SELECT id FROM partner WHERE company_name='Стройсервис'),
     (SELECT id FROM product WHERE name='Инженерная доска Дуб Французская елка однополосная 12 мм'),
     '2024-07-05', 2500,
     2500 * (SELECT min_price_partner FROM product WHERE sku='8858958')
    ),
    ((SELECT id FROM partner WHERE company_name='Ремонт и отделка'),
     (SELECT id FROM product WHERE name='Ламинат Дуб серый 32 класс 8 мм с фаской'),
     '2023-03-20', 59050,
     59050 * (SELECT min_price_partner FROM product WHERE sku='7028748')
    ),
    ((SELECT id FROM partner WHERE company_name='Ремонт и отделка'),
     (SELECT id FROM product WHERE name='Ламинат Дуб дымчато-белый 33 класс 12 мм'),
     '2024-03-12', 37200,
     37200 * (SELECT min_price_partner FROM product WHERE sku='7750282')
    ),
    ((SELECT id FROM partner WHERE company_name='Ремонт и отделка'),
     (SELECT id FROM product WHERE name='Пробковое напольное клеевое покрытие 32 класс 4 мм'),
     '2024-05-14', 4500,
     4500 * (SELECT min_price_partner FROM product WHERE sku='5012543')
    ),
    ((SELECT id FROM partner WHERE company_name='МонтажПро'),
     (SELECT id FROM product WHERE name='Ламинат Дуб дымчато-белый 33 класс 12 мм'),
     '2023-09-19', 50000,
     50000 * (SELECT min_price_partner FROM product WHERE sku='7750282')
    ),
    ((SELECT id FROM partner WHERE company_name='МонтажПро'),
     (SELECT id FROM product WHERE name='Ламинат Дуб серый 32 класс 8 мм с фаской'),
     '2023-11-10', 670000,
     670000 * (SELECT min_price_partner FROM product WHERE sku='7028748')
    ),
    ((SELECT id FROM partner WHERE company_name='МонтажПро'),
     (SELECT id FROM product WHERE name='Паркетная доска Ясень темный однополосная 14 мм'),
     '2024-04-15', 35000,
     35000 * (SELECT min_price_partner FROM product WHERE sku='8758385')
    ),
    ((SELECT id FROM partner WHERE company_name='МонтажПро'),
     (SELECT id FROM product WHERE name='Инженерная доска Дуб Французская елка однополосная 12 мм'),
     '2024-06-12', 25000,
     25000 * (SELECT min_price_partner FROM product WHERE sku='8858958')
    );
