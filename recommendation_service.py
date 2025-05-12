# recommendation_service.py
# Service for handling course recommendations
import pickle
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class RecommendationService:
    """Service for providing course recommendations using a pre-trained model"""
    
    def __init__(self, model_path: str):
        """
        Initialize the recommendation service with a pre-trained model
        
        Args:
            model_path: Path to the pickle file containing the model data
        """
        self.model_data = self._load_model(model_path)
        self.recommend_courses_cosine = self.model_data['recommend_courses_cosine']
        self.course_indices = self.model_data['course_indices']
        self.data = self.model_data['data']
        
    def _load_model(self, model_path: str) -> Dict[str, Any]:
        """
        Load the recommendation model from a pickle file
        
        Args:
            model_path: Path to the pickle file
            
        Returns:
            Dictionary containing the model data
        """
        try:
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            logger.info(f"Model loaded successfully from {model_path}")
            return model_data
        except Exception as e:
            logger.error(f"Error loading model from {model_path}: {e}")
            raise
    
    def get_recommendations(self, course_name: str, num_recommendations: int = 3) -> Dict[str, Any]:
        """
        Get course recommendations based on similarity to the given course
        
        Args:
            course_name: Name of the course to find recommendations for
            num_recommendations: Number of recommendations to return
            
        Returns:
            Dictionary with input course and list of recommended courses
            
        Raises:
            KeyError: If the course name is not found in the dataset
        """
        if course_name not in self.course_indices:
            logger.warning(f"Course not found: {course_name}")
            raise KeyError(f"Course not found: {course_name}")
        
        idx = self.course_indices[course_name]
        sim_scores = list(enumerate(self.recommend_courses_cosine[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:num_recommendations+1]
        recommended = [self.data['course_title'].iloc[i[0]] for i in sim_scores]
        
        logger.debug(f"Recommendations for '{course_name}': {recommended}")
        return {
            'input_course': course_name,
            'recommendations': recommended
        }
    
    def get_all_courses(self) -> List[str]:
        """
        Get a list of all available courses in the dataset
        
        Returns:
            List of course names
        """
        return list(self.course_indices.keys())
