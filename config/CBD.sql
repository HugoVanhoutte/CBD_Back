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
    INDEX (parent_id),
    CONSTRAINT fk_parent_category FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
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
    `id`        BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
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
