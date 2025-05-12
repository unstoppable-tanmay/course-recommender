# Course Recommender

A course recommendation system built with Flask.

## Features

- Recommends courses based on user preferences.
- Uses machine learning for personalized recommendations.

## Installation

1. Install dependencies:
   ```bash
   poetry install
   ```
2. Run the application:
   ```bash
   poetry run gunicorn --bind 0.0.0.0:5000 main:app
   ```

## Deployment

This project is ready for deployment on Render.

## License

MIT
