# app.py
# Main Flask application file
import os
import logging
from flask import Flask, request, jsonify, render_template
from recommendation_service import RecommendationService

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback_secret_key")

# Initialize recommendation service
try:
    recommendation_service = RecommendationService('recommendation_model.pkl')
    logger.info("Recommendation model loaded successfully")
except Exception as e:
    logger.error(f"Error loading recommendation model: {e}")
    recommendation_service = None

@app.route('/')
def home():
    """Render the home page with a form to search for course recommendations"""
    return render_template('index.html')

@app.route('/recommend', methods=['GET'])
def recommend():
    """API endpoint to get course recommendations"""
    if recommendation_service is None:
        return jsonify({'error': 'Recommendation service is not available'}), 500
    
    course_name = request.args.get('course')
    
    if not course_name:
        return jsonify({'error': 'Course name is required'}), 400
    
    try:
        recommendations = recommendation_service.get_recommendations(course_name)
        return jsonify(recommendations)
    except KeyError:
        return jsonify({'error': 'Course not found'}), 404
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

@app.route('/api/courses', methods=['GET'])
def list_courses():
    """API endpoint to get a list of available courses"""
    if recommendation_service is None:
        return jsonify({'error': 'Recommendation service is not available'}), 500
    
    try:
        courses = recommendation_service.get_all_courses()
        return jsonify({'courses': courses})
    except Exception as e:
        logger.error(f"Error getting course list: {e}")
        return jsonify({'error': 'An error occurred while retrieving courses'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500
