// Main JavaScript for the Course Recommendation System

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const courseInput = document.getElementById('course-input');
    const recommendationForm = document.getElementById('recommendation-form');
    const loadingElement = document.getElementById('loading');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const recommendationsList = document.getElementById('recommendations-list');
    const inputCourseElement = document.getElementById('input-course');
    const errorContainer = document.getElementById('error-container');

    // Event listeners
    recommendationForm.addEventListener('submit', getRecommendations);

    // Removed fetchCourses and populateCourseSelect functions as we're using a text input now

    /**
     * Get recommendations for the entered course
     */
    function getRecommendations(event) {
        event.preventDefault();
        
        const enteredCourse = courseInput.value.trim();
        
        if (!enteredCourse) {
            showError('Please enter a course name');
            return;
        }
        
        // Clear previous results and errors
        clearRecommendations();
        hideError();
        showLoading(true);
        
        // Fetch recommendations from API
        fetch(`/recommend?course=${encodeURIComponent(enteredCourse)}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || 'Failed to get recommendations');
                    });
                }
                return response.json();
            })
            .then(data => {
                displayRecommendations(data);
                showLoading(false);
            })
            .catch(error => {
                showError(`Error: ${error.message}`);
                showLoading(false);
            });
    }

    /**
     * Display the recommendations in the UI
     */
    function displayRecommendations(data) {
        inputCourseElement.textContent = data.input_course;
        
        // Create list items for each recommendation
        data.recommendations.forEach((course, index) => {
            const listItem = document.createElement('a');
            listItem.href = '#';
            listItem.className = 'list-group-item list-group-item-action';
            listItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-primary me-2">${index + 1}</span>
                        ${course}
                    </div>
                    <i class="bi bi-chevron-right"></i>
                </div>
            `;
            
            // Add click handler to set this as the new selected course
            listItem.addEventListener('click', (e) => {
                e.preventDefault();
                selectCourse(course);
            });
            
            recommendationsList.appendChild(listItem);
        });
        
        recommendationsContainer.classList.remove('d-none');
    }
    
    /**
     * Select a course from the recommendations and get new recommendations
     */
    function selectCourse(course) {
        // Set the course input value
        courseInput.value = course;
        
        // Get recommendations for the selected course
        getRecommendations(new Event('submit'));
    }

    /**
     * Clear the recommendations list
     */
    function clearRecommendations() {
        recommendationsList.innerHTML = '';
        recommendationsContainer.classList.add('d-none');
    }

    /**
     * Show/hide the loading indicator
     */
    function showLoading(show) {
        if (show) {
            loadingElement.classList.remove('d-none');
        } else {
            loadingElement.classList.add('d-none');
        }
    }

    /**
     * Show an error message
     */
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
    }

    /**
     * Hide the error message
     */
    function hideError() {
        errorContainer.classList.add('d-none');
    }
});
