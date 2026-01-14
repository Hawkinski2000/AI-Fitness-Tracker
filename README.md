# AI-Fitness-Tracker

An AI-powered fitness tracker that generates insights based on diet, exercise, sleep, mood, and bodyweight data.

**Try it now** → [aitracker.fit](https://aitracker.fit)

- A full-stack, agentic AI fitness tracker using FastAPI, PostgreSQL, Docker, and EC2, featuring a GPT-5-powered autonomous agent that can analyze users' health data, interact with the app, call specialized tools, and generate actionable recommendations.
- Implements CI/CD with GitHub Actions, running ~120 Pytest tests, building Docker containers, and deploying to EC2.
- Features a responsive React + TypeScript frontend with HTML/CSS, reusable components, and custom hooks.
- Uses secure authentication (JWTs, HTTP-only refresh tokens), reCAPTCHA, and Nginx for rate/connection limiting.

### AI Chat Interface
![Chat Page](images/chat_page.png)
*Conversational AI agent that analyzes your health data and provides personalized insights*

### Meal Tracking
![View Food Menu](images/view_food_menu.png)
*Comprehensive nutrition logging with custom food database containing ~2 million foods*

### Exercise Tracking
![View Exercise Menu](images/view-exercise-menu.png)
*Detailed workout tracking across ~3,000 exercises, including sets, reps, and performance metrics*

### Sleep Tracking
![Sleep Logs Page](images/sleep-logs-page.png)
*Sleep pattern tracking with subjective quality scores*

### Weight Tracking
![Weight Logs Page](images/weight-logs-page.png)
*Bodyweight tracking with visual progress charts*

### User Experience
![User Flow Diagram](images/User%20Flow%20Diagram%20-%20AI%20Fitness%20Tracker.png)
*User flow diagram*

### Database Design
![Entity Relationship Diagram](images/Entity%20Relationship%20Diagram%20-%20AI%20Fitness%20Tracker.svg)
*Database schema and entity relationships*
