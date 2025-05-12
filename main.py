# main.py
# Entry point for the Flask application
from app import app
import logging

if __name__ == '__main__':
    # Set up logging for easier debugging
    logging.basicConfig(level=logging.DEBUG)
    # Run the app on 0.0.0.0 to make it accessible externally
    # Port 5000 is required as per development guidelines
    app.run(host='0.0.0.0', port=5000, debug=True)
