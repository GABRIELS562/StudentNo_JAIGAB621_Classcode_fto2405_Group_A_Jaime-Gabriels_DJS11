# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# PodBlast - Podcast Discovery and Listening Platform

PodBlast is a modern, feature-rich web application for discovering, managing, and listening to podcasts. Built with React and Vite, and leveraging the power of various libraries, PodBlast offers a seamless and engaging podcast experience.

## Features

- Browse and search through a wide range of podcasts
- Play podcast episodes directly in the app
- Mark favorites and manage a personal library
- Track listening history and resume playback
- Sort and filter podcasts by various criteria
- Responsive design for optimal viewing on all devices

## Dependencies

This project relies on the following main dependencies:

- React
- React Router Dom
- @radix-ui/themes
- @radix-ui/react-icons
- react-slick
- slick-carousel
- Vite (as the build tool)

For a complete list of dependencies, please refer to the `package.json` file.

## Setup and Installation

1. Ensure you have Node.js and npm installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

2. Clone the repository:
   ```
   git clone https://github.com/your-username/podblast.git
   ```

3. Navigate to the project directory:
   ```
   cd podblast
   ```

4. Install dependencies using npm:
   ```
   npm install
   ```

5. Start the development server:
   ```
   npm run dev
   ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is occupied).

## Building for Production

To create a production build, run:
```
npm run build
```

This will generate optimized files in the `dist` directory.

## API

PodBlast uses the following API endpoints:

- Base URL: `https://podcast-api.netlify.app`
- Shows list: `${API_BASE_URL}/shows`
- Show details: `${API_BASE_URL}/id/${showId}`

## Components

The application is built with the following main components:

- `Home`: Landing page with featured podcasts
- `ShowList`: Displays all available podcasts with sorting and filtering options
- `ShowDetails`: Detailed view of a specific podcast
- `Favorites`: User's favorite podcasts
- `CompletedEpisodes`: User's listening history
- `AudioPlayer`: Controls for playing podcast episodes

## Styling

The app uses a combination of custom CSS and Radix UI components for styling. The color scheme and layout can be customized in the `App.css` file.

## Contributing

Contributions to PodBlast are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).