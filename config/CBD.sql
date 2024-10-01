CREATE DATABASE StoneLand;

USE StoneLand;

CREATE TABLE products
(
    `id`          BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `name`        TINYTEXT NOT NULL,
    `description` TEXT DEFAULT NULL,
    `price`       INT      NOT NULL,
    `images`      JSON DEFAULT NULL
);

CREATE TABLE categories
(
    `id`        BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `parent_id` BIGINT DEFAULT null,
    `name`      TINYTEXT NOT NULL,
    INDEX (parent_id)
);

CREATE TABLE products_categories
(
    `id`          BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `product_id`  BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    FOREIGN KEY (`product_id`) REFERENCES products (`id`),
    FOREIGN KEY (`category_id`) REFERENCES categories (`id`)

);

CREATE TABLE users
(
    `id`        BIGINT UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email`     VARCHAR(255) UNIQUE       NOT NULL,
    `username`  TINYTEXT                  NOT NULL,
    `password`  TINYTEXT                  NOT NULL,
    `role`      ENUM ('admin', 'user') DEFAULT 'user',
    `basket`    JSON                   DEFAULT null,
    `favorites` JSON                   DEFAULT null
);

CREATE TABLE orders
(
    `id`         BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id`    BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `products`   JSON   NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES users (`id`)
);



ALTER TABLE categories
    ADD FOREIGN KEY (`id`) REFERENCES categories (`parent_id`);

CREATE TABLE orders_users
(
    `orders_user_id` BIGINT,
    `users_id`       BIGINT,
    PRIMARY KEY (`orders_user_id`, `users_id`)
);

ALTER TABLE orders_users
    ADD FOREIGN KEY (`orders_user_id`) REFERENCES orders (`id`);

ALTER TABLE orders_users
    ADD FOREIGN KEY (`users_id`) REFERENCES users (`id`);

ALTER TABLE products
    ADD FOREIGN KEY (`id`) REFERENCES products_categories (`product_id`);

ALTER TABLE categories
    ADD FOREIGN KEY (`id`) REFERENCES products_categories (`category_id`);

ALTER TABLE categories
    ADD FOREIGN KEY (parent_id) REFERENCES categories (id);
