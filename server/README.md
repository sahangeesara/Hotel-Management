<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Hotel Management System - Setup Instructions

### Installation

1. Clone the repository
2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database in `.env` file

6. Run migrations:
```bash
php artisan migrate
```

7. Seed the database:
```bash
php artisan db:seed
```

### Password Reset with Queue

This application uses Laravel Queue for sending password reset emails asynchronously.

#### Setup Queue Tables

Run the following commands to create the queue tables:

```bash
php artisan queue:table
php artisan migrate
```

#### Queue Configuration

The application is configured to use database queue driver. Ensure your `.env` file has:

```env
QUEUE_CONNECTION=database
```

#### Start Queue Worker

To process queued jobs (including password reset emails), run:

```bash
php artisan queue:work
```

For production, use a process manager like Supervisor to keep the queue worker running.

#### Password Reset Logging

Password reset links and tokens are automatically logged to `storage/logs/laravel.log` for development purposes. Each password reset request will log:
- Recipient email address
- Reset token
- Full reset URL
- Complete email content in readable format

**Example log output:**
```
[2026-07-23 09:00:00] local.DEBUG: From: Laravel <hello@example.com>
To: user@example.com
Subject: Reset Password Mail

# Hello!

You are receiving this email because we received a password reset request for your account.

Reset Password: http://localhost:4200/response-password-reset?token=YOUR_TOKEN_HERE

Token: YOUR_TOKEN_HERE

This password reset link will expire in 60 minutes.
```

Check the logs at `storage/logs/laravel.log` to view the password reset links during development.

### Features

- **User Authentication**: JWT-based authentication system
- **Role-based Access Control**: Multiple user roles with different permissions
- **Room Management**: Manage hotel rooms, categories, and bookings
- **Guest Management**: Track guest information and bookings
- **Event Management**: Handle hotel events, weddings, and restaurant bookings
- **Travel Booking**: Manage transport bookings for guests
- **Order Management**: Food ordering system
- **Employee Management**: Track hotel staff and their roles
- **Package Management**: Create and manage tour packages
- **Queue System**: Asynchronous email processing with logging

### Running the Application

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

Don't forget to run the queue worker in a separate terminal:

```bash
php artisan queue:work
```
