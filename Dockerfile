# Use PHP 8.1 (since you need to stick with it)
FROM php:8.1-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y default-mysql-client \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel files
COPY . .

# Ensure we use the correct dependencies for PHP 8.1
RUN composer update --no-dev --optimize-autoloader --ignore-platform-reqs

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Start PHP-FPM server
CMD ["php-fpm"]
