// framework/quizkit.js

const Quizkit = (() => {
  // Application state
  let appState = {
    quizData: null,
    currentQuestionIndex: 0,
    answers: [],
    timer: null,
    timeRemaining: 0,
  };

  // Configuration options
  let config = {
    timerEnabled: false,
    feedbackOnEachQuestion: false,
  };

  // Routes
  const routes = {};

  // Initialize the application with configuration options
  const initializeApp = (options = {}) => {
    config = { ...config, ...options };
  };

  // Add a route with its handler
  const addRoute = (path, handler) => {
    routes[path] = handler;
  };

  // Navigate to a new path
  const navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    handleLocation();
  };

  // Handle the current location (URL)
  const handleLocation = async () => {
    const path = window.location.pathname || '/';
    const route = routes[path] || routes['/404'];
    if (route) {
      await route();
      if (path !== '/quiz') {
        stopTimer();
      }
    }
  };

  // Get a query parameter from the URL
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Load quiz data from the given path
  const loadQuiz = (path) => {
    return fetch(path).then((res) => res.json());
  };

  // Start the quiz with the provided data
  const startQuiz = (quizData) => {
  	stopTimer();
    updateState({
      quizData,
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: quizData.timeLimit,
    });
    renderCurrentQuestion();
    if (config.timerEnabled) {
      startTimer();
    }
  };

  // Get the quiz results after the quiz ends
  const getQuizResults = () => {
    const { quizData, answers } = appState;
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correctOption) {
        score++;
      }
    });
    return {
      score,
      totalQuestions: quizData.questions.length,
      passed: score >= quizData.passingScore,
    };
  };

  // Render a template with data
  const renderTemplate = async (templateName, data) => {
    const template = await loadTemplate(templateName);
    const rendered = render(template, data);
    document.getElementById('app').innerHTML = rendered;
  };

  // Load template from the framework's templates folder
  const loadTemplate = (templateName) => {
    return fetch(`framework/templates/${templateName}.html`).then((res) =>
      res.text()
    );
  };

  // Simple template rendering function
  const render = (templateString, data) => {
    return templateString.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : '';
    });
  };

  // Format time in mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Update the application state
  const updateState = (newState) => {
    appState = { ...appState, ...newState };
  };

  // Get the current application state
  const getState = () => ({ ...appState });

  // Start the timer
  const startTimer = () => {
    appState.timer = setInterval(() => {
      const { timeRemaining } = appState;
      if (timeRemaining <= 0) {
        clearInterval(appState.timer);
        navigateTo('/results');
      } else {
        updateState({ timeRemaining: timeRemaining - 1 });
        // Update timer display
        const timerElement = document.querySelector('.quiz__timer');
        if (timerElement) {
          timerElement.textContent = formatTime(timeRemaining - 1);
        }
      }
    }, 1000);
  };
 // Stop the timer
  const stopTimer = () => {
    if (appState.timer) {
      clearInterval(appState.timer);
      appState.timer = null;
    }
  };
  
  // Render the current question
  const renderCurrentQuestion = async () => {
    const { quizData, currentQuestionIndex, answers } = appState;
    const questionData = quizData.questions[currentQuestionIndex];

    const template = await loadTemplate('quiz-template');

    // Generate options HTML
    let optionsHtml = '';
    questionData.options.forEach((option, index) => {
      const isSelected =
        answers[currentQuestionIndex] === index
          ? 'quiz__option--selected'
          : '';
      optionsHtml += `<li class="quiz__option ${isSelected}" data-value="${index}">${option}</li>`;
    });

    // Generate content HTML based on content type
    let contentHtml = '';
    if (questionData.content) {
      switch (questionData.content.type) {
        case 'image':
          contentHtml = `<img src="${questionData.content.src}" alt="${questionData.content.alt}" class="quiz__image">`;
          break;
        case 'video':
          contentHtml = `<div class="quiz__video-container">
            <iframe src="${questionData.content.src}" frameborder="0" allowfullscreen></iframe>
          </div>`;
          break;
        case 'code':
          contentHtml = `<pre class="quiz__code"><code class="language-${questionData.content.language}">${questionData.content.code}</code></pre>`;
          break;
      }
    }

    // Generate question indicators HTML
    let questionIndicatorsHtml = '';
    quizData.questions.forEach((_, index) => {
      const isActive = index === currentQuestionIndex ? 'quiz__indicator--active' : '';
      questionIndicatorsHtml += `<div class="quiz__indicator ${isActive}" data-index="${index}">${index + 1}</div>`;
    });

    // Calculate progress percentage
    const progressPercentage = (
      ((currentQuestionIndex + 1) / quizData.questions.length) *
      100
    ).toFixed(2);

    // Calculate correct answers count
    let correctAnswersCount = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correctOption) {
        correctAnswersCount++;
      }
    });

    // Determine if "Previous" button should be disabled
    const prevDisabled = currentQuestionIndex === 0 ? 'disabled' : '';

    // Determine the text for the "Next" button
    const nextButtonText =
      currentQuestionIndex === quizData.questions.length - 1 ? 'Finish' : 'Next';

    const rendered = render(template, {
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: quizData.questions.length,
      questionContent: questionData.question,
      content: contentHtml,
      options: optionsHtml,
      questionIndicators: questionIndicatorsHtml,
      progressPercentage,
      timer: formatTime(appState.timeRemaining),
      correctAnswersCount,
      prevDisabled,
      nextButtonText,
    });

    document.getElementById('app').innerHTML = rendered;

    // Apply syntax highlighting if using code snippets
    if (questionData.content && questionData.content.type === 'code') {
      if (window.Prism) {
        Prism.highlightAll();
      }
    }
  };

  // Handle option selection
  document.addEventListener('click', (e) => {
    if (e.target.matches('.quiz__option')) {
      const selectedValue = parseInt(e.target.getAttribute('data-value'));
      const { answers, currentQuestionIndex } = appState;

      answers[currentQuestionIndex] = selectedValue;
      updateState({ answers });

      // Re-render the current question to update the selected option
      renderCurrentQuestion();
    }
  });

  // Handle clicks on question indicators
  document.addEventListener('click', (e) => {
    if (e.target.matches('.quiz__indicator')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      updateState({ currentQuestionIndex: index });
      renderCurrentQuestion();
    }
  });

  // Handle navigation buttons
  document.addEventListener('click', (e) => {
    if (e.target.matches('#next-button')) {
      const { currentQuestionIndex, quizData } = appState;
      if (currentQuestionIndex < quizData.questions.length - 1) {
        updateState({ currentQuestionIndex: currentQuestionIndex + 1 });
        renderCurrentQuestion();
      } else {
        navigateTo('/results');
      }
    } else if (e.target.matches('#prev-button')) {
      const { currentQuestionIndex } = appState;
      if (currentQuestionIndex > 0) {
        updateState({ currentQuestionIndex: currentQuestionIndex - 1 });
        renderCurrentQuestion();
      }
    }
  });

  // Expose public functions
  return {
    initializeApp,
    addRoute,
    handleLocation,
    navigateTo,
    getQueryParam,
    loadQuiz,
    startQuiz,
    getQuizResults,
    renderTemplate,
    formatTime,
    getState,
    updateState,
  };
})();
