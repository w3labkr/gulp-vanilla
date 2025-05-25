# gulp-vanilla

A simple and efficient Gulp setup for modern web development.

## Project Structure

The project directory is organized as follows:

```plaintext
/ (root)
├── dist/                 # Distribution folder for build outputs
├── LICENSE               # License file
├── README.md             # Project documentation
├── gulpfile.js           # Gulp task definitions
├── package-lock.json     # Dependency lock file
├── package.json          # Project metadata and dependencies
└── tailwind.config.js    # TailwindCSS configuration
```

This structure ensures a clean and modular organization for the project.

## Features

- **Task Automation**: Automate repetitive tasks like minification, concatenation, and more.
- **TailwindCSS Integration**: Built-in support for TailwindCSS.
- **PostCSS Support**: Process your CSS with PostCSS plugins like Autoprefixer and CSSNano.
- **Image Optimization**: Optimize images with `gulp-imagemin`.
- **Code Formatting**: Beautify and lint your code with Prettier and ESLint.

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

### Development

Start the development server and watch for file changes:

```bash
npm run watch
```

### Build

Generate a production-ready build:

```bash
npm run build
```

### Clean

Remove `node_modules`, cache, and build files:

```bash
npm run clean
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
