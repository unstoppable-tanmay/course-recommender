// Main JavaScript for the Course Recommendation System

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const courseSelect = document.getElementById('course-select');
    const recommendationForm = document.getElementById('recommendation-form');
    const loadingElement = document.getElementById('loading');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const recommendationsList = document.getElementById('recommendations-list');
    const inputCourseElement = document.getElementById('input-course');
    const errorContainer = document.getElementById('error-container');

    // Fetch all courses and populate the dropdown
    fetchCourses();

    // Event listeners
    recommendationForm.addEventListener('submit', getRecommendations);

    /**
     * Fetch all available courses from the API
     */
    function fetchCourses() {
        showLoading(true);
        
        fetch('/api/courses')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                return response.json();
            })
            .then(data => {
                populateCourseSelect(data.courses);
                showLoading(false);
            })
            .catch(error => {
                showError(`Error fetching courses: ${error.message}`);
                showLoading(false);
            });
    }

    /**
     * Populate the course select dropdown with available courses
     */
    function populateCourseSelect(courses) {
        // Sort courses alphabetically
        courses.sort();
        
        // Add each course as an option
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
        });
    }

    /**
     * Get recommendations for the selected course
     */
    function getRecommendations(event) {
        event.preventDefault();
        
        const selectedCourse = courseSelect.value;
        
        if (!selectedCourse) {
            showError('Please select a course');
            return;
        }
        
        // Clear previous results and errors
        clearRecommendations();
        hideError();
        showLoading(true);
        
        // Fetch recommendations from API
        fetch(`/recommend?course=${encodeURIComponent(selectedCourse)}`)
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
        // Find and select the course in the dropdown
        for (let i = 0; i < courseSelect.options.length; i++) {
            if (courseSelect.options[i].value === course) {
                courseSelect.selectedIndex = i;
                break;
            }
        }
        
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
