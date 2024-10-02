CREATE DATABASE StoneLand;

USE StoneLand;

CREATE TABLE products
(
    `id`          BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `name`        TINYTEXT NOT NULL,
    `description` TEXT DEFAULT NULL,
    `price`       INT NOT NULL,
    `images`      JSON DEFAULT NULL
) ENGINE = InnoDB;

CREATE TABLE categories
(
    `id`        BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `parent_id` BIGINT DEFAULT NULL,
    `name`      TINYTEXT NOT NULL,
    INDEX (parent_id),
    FOREIGN KEY (parent_id) REFERENCES categories(id)
) ENGINE = InnoDB;

CREATE TABLE products_categories
(
    `id`          BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `product_id`  BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    FOREIGN KEY (`product_id`) REFERENCES products (`id`),
    FOREIGN KEY (`category_id`) REFERENCES categories (`id`)
) ENGINE = InnoDB;

CREATE TABLE users
(
    `id`        BIGINT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `email`     VARCHAR(255) UNIQUE NOT NULL,
    `username`  TINYTEXT NOT NULL,
    `password`  TINYTEXT NOT NULL,
    `role`      ENUM ('admin', 'user') DEFAULT 'user',
    `basket`    JSON DEFAULT NULL,
    `favorites` JSON DEFAULT NULL
) ENGINE = InnoDB;

CREATE TABLE orders
(
    `id`         BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id`    BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `products`   JSON NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES users (`id`)
) ENGINE = InnoDB;

CREATE TABLE orders_users
(
    `orders_user_id` BIGINT,
    `users_id`       BIGINT,
    PRIMARY KEY (`orders_user_id`, `users_id`),
    FOREIGN KEY (`orders_user_id`) REFERENCES orders (`id`),
    FOREIGN KEY (`users_id`) REFERENCES users (`id`)
) ENGINE = InnoDB;
