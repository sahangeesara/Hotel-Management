[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)
[![npm-coreui-angular][npm-coreui-angular-badge]][npm-coreui-angular]
[![npm-coreui-angular][npm-coreui-angular-badge-next]][npm-coreui-angular]
[![NPM downloads][npm-coreui-angular-download]][npm-coreui-angular]  
[![@coreui coreui](https://img.shields.io/badge/@coreui%20-coreui-lightgrey.svg?style=flat-square)](https://github.com/coreui/coreui)
[![npm package][npm-coreui-badge]][npm-coreui]
[![NPM downloads][npm-coreui-download]][npm-coreui]  
![angular](https://img.shields.io/badge/angular-^18.1.0-lightgrey.svg?style=flat-square&logo=angular)

[npm-coreui-angular]: https://www.npmjs.com/package/@coreui/angular

[npm-coreui-angular-badge]: https://img.shields.io/npm/v/@coreui/angular.png?style=flat-square

[npm-coreui-angular-badge-next]: https://img.shields.io/npm/v/@coreui/angular/next?style=flat-square&color=red

[npm-coreui-angular-download]: https://img.shields.io/npm/dm/@coreui/angular.svg?style=flat-square

[npm-coreui]: https://www.npmjs.com/package/@coreui/coreui

[npm-coreui-badge]: https://img.shields.io/npm/v/@coreui/coreui.png?style=flat-square

[npm-coreui-download]: https://img.shields.io/npm/dm/@coreui/coreui.svg?style=flat-square

# Hotel Management System - Angular 18

A comprehensive hotel management system built with Angular 18 and CoreUI, providing complete booking management, guest services, and travel coordination.

## Features

### Guest Management
- Guest registration and profile management
- Multi-room allocation support
- Guest country tracking and reporting

### Room Booking
- Real-time room availability
- Multi-room booking support
- Check-in/Check-out management

### Travel Services
- **Transport Booking**: Vehicle rentals, airport transfers, and tour services
  - Province-based service selection
  - Multiple vehicle and service types
  - Pickup/Drop location management
  - Custom duration options
- Event booking and management
- Travel itinerary coordination

### Reporting
- Guest analytics and reporting
- Booking statistics
- Country-wise guest distribution

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Project Structure](#project-structure)
* [Development](#development)
* [Build](#build)
* [Testing](#testing)
* [CoreUI Documentation](#coreui-documentation)

## Prerequisites

Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js

[**Angular 18**](https://angular.io/guide/what-is-angular) requires `Node.js` LTS version `^18.19` or `^20.09`.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).

###### Angular CLI

Install the Angular CLI globally using a terminal/console window.

```bash
npm install -g @angular/cli
```

## Installation

```bash
npm install
npm update
```

## Basic Usage

```bash
# Development server with hot reload at http://localhost:4200
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200). The app will automatically reload if you change any of the source files.

## Project Structure

```
client_angular/
├── src/
│   ├── app/
│   │   ├── layout/
│   │   │   └── default-layout/
│   │   │       └── _nav.ts          # Navigation configuration
│   │   ├── services/
│   │   │   ├── all-service.service.ts
│   │   │   ├── hotel.service.ts
│   │   │   ├── travel-booking.service.ts
│   │   │   └── search.service.ts
│   │   └── views/
│   │       └── admin/
│   │           └── components/
│   │               ├── travel/
│   │               │   └── transport-book/   # Transport booking module
│   │               ├── guests/               # Guest management
│   │               ├── rooms/                # Room booking
│   │               └── reports/              # Analytics & reports
│   ├── assets/                   # Static assets
│   ├── scss/                     # Global styles
│   └── index.html
├── angular.json
├── package.json
└── README.md
```

## Development

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code Scaffolding

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
# Production build with minification
npm run build
```

## Testing

### Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice.

## Technology Stack

- **Framework**: Angular 18
- **UI Library**: CoreUI for Angular
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Reactive Forms
- **Notifications**: ngx-toastr
- **Date Handling**: Angular DatePipe
- **Styling**: SCSS

## Backend Integration

This Angular application connects to a Laravel backend API. Ensure the backend server is running before starting the frontend application.

Backend repository: `../server`

## CoreUI Documentation

The documentation for the CoreUI Admin Template is hosted at [CoreUI for Angular](https://coreui.io/angular/)

---

This project was built with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

## License

Built on CoreUI Free Angular Admin Template

CoreUI is an MIT-licensed open source project. For more information about CoreUI:
- [CoreUI for Angular](https://coreui.io/angular)
- [CoreUI Documentation](https://coreui.io/angular/docs/)
- [CoreUI GitHub](https://github.com/coreui/coreui-free-angular-admin-template)
