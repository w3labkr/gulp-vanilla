# gulp-vanilla

A simple and efficient Gulp setup for modern web development.

## Directory Structure

```text
src/                     # Source files for the project
├── assets/              # Static assets
│   ├── css/             # CSS files
│   ├── fonts/           # Font files
│   ├── images/          # Image files
│   └── js/              # JavaScript files
├── data/                # Data files (e.g., JSON, CSV)
├── en/                  # English version of the site
├── index.html           # Main HTML file for the default language
├── template-parts/      # Reusable HTML partials/components
└── templates/           # Page layout templates
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/w3labkr/gulp-vanilla.git
   ```

2. Navigate to the project directory:

   ```bash
   cd gulp-vanilla
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Available scripts:

* `npm test`: Echoes an error message as no tests are specified.
* `npm run watch`: Starts Gulp in watch mode, recompiling assets on change.
* `npm run build`: Builds the project for production.
* `npm run clean:files`: Removes `node_modules`, `package-lock.json`, and the `dist` folder.
* `npm run clean:cache`: Cleans the npm cache.
* `npm run clean`: Runs both `clean:files` and `clean:cache`.
* `npm run upgrade:latest`: Cleans the project, updates dependencies to their latest versions, and reinstalls them.
* `npm run reinstall`: Cleans the project and reinstalls dependencies.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
