// app/main.js

// Initialize the application with configuration options
Quizkit.initializeApp({
  timerEnabled: true,
  feedbackOnEachQuestion: false,
});

// Define routes
Quizkit.addRoute('/', renderHomePage);
Quizkit.addRoute('/quiz', renderQuizPage);
Quizkit.addRoute('/results', renderResultsPage);

// Function to render the Home Page
function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="home">
      <h1>Quizzes</h1>
      <ul>
        <li><a href="/quiz?id=ww2" data-link>World War II Quiz</a></li>
        <li><a href="/quiz?id=ancient" data-link>Ancient Civilizations Quiz</a></li>
        <li><a href="/quiz?id=code" data-link>JavaScript Basics Quiz</a></li>
        <li><a href="/quiz?id=moon-landing" data-link>The Moon Landing Quiz</a></li>
        <li><a href="/quiz?id=openformat-api" data-link>OPENFORMAT Quiz</a></li>
      </ul>
    </div>
  `;
}


// Function to render the Quiz Page
function renderQuizPage() {
  const quizId = Quizkit.getQueryParam('id');
  Quizkit.loadQuiz(`app/quizzes/${quizId}-quiz.json`)
    .then((quizData) => {
      Quizkit.startQuiz(quizData);
    })
    .catch(() => {
      document.getElementById('app').innerHTML = '<h2>Quiz not found.</h2>';
    });
}

// Function to render the Results Page
function renderResultsPage() {
  const results = Quizkit.getQuizResults();

  // Determine if the quiz ended due to time running out
  const timeUp = Quizkit.getState().timeRemaining <= 0;

  const templateData = {
    score: results.score,
    totalQuestions: results.totalQuestions,
    feedback: results.passed
      ? 'Congratulations! You passed the quiz.'
      : 'Unfortunately, you did not pass the quiz.',
    timeUpMessage: timeUp ? 'Your time ran out!' : '',
  };

  Quizkit.renderTemplate('results-template', templateData);

  // Add event listener for the "Return to Home" button
  document.addEventListener('click', handleRetryButtonClick);
}

// Handle "Return to Home" button click
function handleRetryButtonClick(e) {
  if (e.target.matches('#retry-button')) {
    e.preventDefault();
    Quizkit.navigateTo('/');
    // Remove the event listener to prevent duplicate handlers
    document.removeEventListener('click', handleRetryButtonClick);
  }
}

// Start handling routes
Quizkit.handleLocation();

// Listen for navigation events
window.onpopstate = Quizkit.handleLocation;
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    Quizkit.navigateTo(e.target.getAttribute('href'));
  }
});
