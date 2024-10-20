# Quizkit

OK, the human bit first. The readme below is Ai generated and a fine job it's done too but an introduction is still in order. 

This project is an experiment in creating a simple system based on machine readable content, created by a machine. Quiz's are easy fodder for experimenting with structured data as frankly there's not a lot to it and its very predictable. With the JSON data format created for simple quiz's, now we can get GPT (40) to search a website and create questions from it, outputting in JSON. I needed a simple framework to parse these JSON files into an "experience"; and here we are. A really simple framework for creating quiz's (quizzes?). 

**Quizkit** is a customisable quiz application framework designed to help developers create engaging and interactive quizzes with ease. Whether you're building educational tools, training modules, or just want to test your knowledge, Quizkit provides a structured and flexible foundation to get you started quickly.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Adding Quizzes](#adding-quizzes)
- [Including Rich Content](#including-rich-content)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multiple Quizzes:** Easily add and manage multiple quizzes, each with its own set of questions.
- **Rich Content Support:** Incorporate images, YouTube videos, and code snippets to make your questions more engaging.
- **Progress Indicators:** Visual indicators to show users their progress through the quiz.
- **Timed Quizzes:** Optional timers to add a sense of urgency.
- **Responsive Design:** Ensures your quizzes look great on all devices.
- **Syntax Highlighting:** Uses Prism.js to highlight code snippets within questions.
- **Simple Routing:** Navigate between different pages without full page reloads.

## Technologies Used

- **HTML5 & CSS3:** Structure and styling of the application.
- **JavaScript (ES6):** Core functionality and interactivity.
- **Prism.js:** Syntax highlighting for code snippets.
- **Fetch API:** Loading quiz data and templates.
- **BEM Methodology:** Organized and maintainable CSS class naming.
- **Local Server:** Required for serving the application (e.g., Python's `http.server` or Node.js's `http-server`).

## Project Structure

```
/quizkit-app
│
├── index.html
│
├── /app
│   ├── main.js
│   ├── styles.css
│   ├── /quizzes
│   │   ├── ww2-quiz.json
│   │   ├── ancient-quiz.json
│   │   └── code-quiz.json
│   └── /images
│       └── churchill.jpg
│
├── /framework
│   ├── quizkit.js
│   ├── quizkit-styles.css
│   └── /templates
│       ├── quiz-template.html
│       └── results-template.html
│
└── README.md
```

- **index.html:** The entry point of the application.
- **/app:** Contains all developer-specific files.
  - **main.js:** Initializes the app and defines routes.
  - **styles.css:** Custom styles for the application.
  - **/quizzes:** JSON files defining each quiz's content.
  - **/images:** Directory for storing image assets used in quizzes.
- **/framework:** Contains Quizkit's core files (do not modify).
  - **quizkit.js:** Core framework logic.
  - **quizkit-styles.css:** Default styles provided by Quizkit.
  - **/templates:** HTML templates used by the framework.
    - **quiz-template.html:** Template for rendering quiz pages.
    - **results-template.html:** Template for rendering results pages.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/redeye/quizkit-app.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd quizkit-app
   ```

3. **Ensure You Have a Local Server:**

   Since the application uses local files and fetch requests, it needs to be served over a local server.

   - **Using Python 3:**

     ```bash
     python -m http.server 8000
     ```

   - **Using Node.js's `http-server`:**

     First, install `http-server` globally if you haven't:

     ```bash
     npm install -g http-server
     ```

     Then, start the server:

     ```bash
     http-server -p 8000
     ```

   - **Using VSCode's Live Server Extension:**

     If you're using Visual Studio Code, you can install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and start the server directly from the editor.

## Running the Application

1. **Start the Local Server:**

   Refer to the [Installation](#installation) section for instructions on starting a local server.

2. **Open Your Browser:**

   Navigate to `http://localhost:8000/` (or the port you specified) to view the application.

3. **Interact with the Quizzes:**

   - **Home Page:** Select from the available quizzes.
   - **Quiz Page:** Answer questions, view progress, and utilize rich content.
   - **Results Page:** View your score and feedback upon completing the quiz.

## Adding Quizzes

To add a new quiz to your application:

1. **Create a New JSON File:**

   In the `/app/quizzes/` directory, create a new JSON file (e.g., `history-quiz.json`).

2. **Define the Quiz Structure:**

   Here's a template to guide you:

   ```json
   {
     "id": "history",
     "title": "History Quiz",
     "timeLimit": 180,
     "passingScore": 5,
     "questions": [
       {
         "type": "multiple-choice",
         "question": "Who was the first President of the United States?",
         "options": ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
         "correctOption": 0
       },
       {
         "type": "true-false",
         "question": "The Great Wall of China is visible from space.",
         "options": ["True", "False"],
         "correctOption": 1
       },
       {
         "type": "multiple-choice",
         "question": "Identify the event shown in the image.",
         "content": {
           "type": "image",
           "src": "app/images/some-event.jpg",
           "alt": "Description of the image"
         },
         "options": ["Event A", "Event B", "Event C", "Event D"],
         "correctOption": 2
       }
       // Add more questions as needed
     ]
   }
   ```

   - **Fields Explained:**
     - **id:** Unique identifier for the quiz (used in URLs).
     - **title:** Display name of the quiz.
     - **timeLimit:** Total time for the quiz in seconds.
     - **passingScore:** Minimum number of correct answers to pass.
     - **questions:** Array of question objects.
       - **type:** Type of question (`"multiple-choice"` or `"true-false"`).
       - **question:** The question text.
       - **content:** (Optional) Additional content like images, videos, or code snippets.
       - **options:** Array of answer options.
       - **correctOption:** Index of the correct option in the `options` array.

3. **Add the Quiz to the Home Page:**

   Update the `renderHomePage` function in `app/main.js` to include a link to your new quiz.

   ```javascript
   function renderHomePage() {
     const app = document.getElementById('app');
     app.innerHTML = `
       <div class="home">
         <h1>Quizzes</h1>
         <ul>
           <li><a href="/quiz?id=ww2" data-link>World War II Quiz</a></li>
           <li><a href="/quiz?id=ancient" data-link>Ancient Civilizations Quiz</a></li>
           <li><a href="/quiz?id=code" data-link>JavaScript Basics Quiz</a></li>
           <li><a href="/quiz?id=history" data-link>History Quiz</a></li> <!-- New Quiz -->
         </ul>
       </div>
     `;
   }
   ```

4. **Add Necessary Media Assets:**

   If your quiz includes images or videos, place them in the appropriate directories (e.g., `/app/images/`).

## Including Rich Content

Quizkit allows you to enrich your quizzes with various types of content to enhance the user experience.

### Supported Content Types

1. **Images:**

   Embed images within questions to provide visual context.

   **Example:**

   ```json
   {
     "type": "multiple-choice",
     "question": "Identify the leader shown in the image.",
     "content": {
       "type": "image",
       "src": "app/images/churchill.jpg",
       "alt": "Image of Winston Churchill"
     },
     "options": ["Franklin D. Roosevelt", "Winston Churchill", "Joseph Stalin", "Adolf Hitler"],
     "correctOption": 1
   }
   ```

2. **Videos (YouTube Embeds):**

   Embed YouTube videos to provide instructional or contextual information.

   **Example:**

   ```json
   {
     "type": "multiple-choice",
     "question": "After watching the video, answer the following question:",
     "content": {
       "type": "video",
       "src": "https://www.youtube.com/embed/dQw4w9WgXcQ"
     },
     "options": ["Option A", "Option B", "Option C", "Option D"],
     "correctOption": 1
   }
   ```

3. **Code Snippets:**

   Include code snippets to test programming knowledge. Syntax highlighting is handled by Prism.js.

   **Example:**

   ```json
   {
     "type": "multiple-choice",
     "question": "What is the output of the following code?",
     "content": {
       "type": "code",
       "language": "javascript",
       "code": "console.log(typeof null);"
     },
     "options": ["'object'", "'null'", "'undefined'", "'number'"],
     "correctOption": 0
   }
   ```

### Adding Code Snippets

1. **Ensure Prism.js is Included:**

   In your `index.html`, make sure Prism.js is included via CDN for syntax highlighting.

   ```html
   <!-- Prism.js script for code highlighting -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/prism.min.js"></script>
   <!-- Include the language you need, e.g., JavaScript -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/components/prism-javascript.min.js"></script>
   ```

2. **Define Code Content in Quiz JSON:**

   Use the `content` field with `type` set to `"code"`, specify the `language`, and include the `code`.

   ```json
   {
     "type": "multiple-choice",
     "question": "What does the following function return?",
     "content": {
       "type": "code",
       "language": "javascript",
       "code": "function test() {\n  return;\n  {\n    name: 'Quizkit';\n  }\n}\nconsole.log(typeof test());"
     },
     "options": ["'object'", "'undefined'", "'number'", "'function'"],
     "correctOption": 1
   }
   ```

## Customization

### Styling

- **Override Framework Styles:**

  Use your `app/styles.css` to override or extend the default styles provided by Quizkit (`framework/quizkit-styles.css`).

  **Example:**

  ```css
  /* app/styles.css */

  /* Change the background color of selected options */
  .quiz__option--selected {
    background-color: #ffd54f;
  }

  /* Customize the results feedback */
  .results__feedback {
    font-size: 1.5em;
    color: #007bff;
  }

  .results__feedback--fail {
    color: #dc3545;
  }
  ```

### Adding New Routes

If you want to add additional pages or functionalities, define new routes in `app/main.js`.

**Example: Adding an About Page:**

1. **Define the Route:**

   ```javascript
   // app/main.js

   // Add the About route
   Quizkit.addRoute('/about', renderAboutPage);

   // Function to render the About Page
   function renderAboutPage() {
     const app = document.getElementById('app');
     app.innerHTML = `
       <div class="about">
         <h1>About Quizkit</h1>
         <p>Quizkit is a customizable quiz framework designed to help developers build interactive quizzes effortlessly.</p>
         <button id="back-button" class="about__button">Back to Home</button>
       </div>
     `;
   }

   // Handle "Back to Home" button click
   function handleBackButtonClick(e) {
     if (e.target.matches('#back-button')) {
       e.preventDefault();
       Quizkit.navigateTo('/');
     }
   }

   // Add event listener for the "Back to Home" button
   document.addEventListener('click', handleBackButtonClick);
   ```

2. **Update the Home Page to Include a Link to the About Page:**

   ```javascript
   function renderHomePage() {
     const app = document.getElementById('app');
     app.innerHTML = `
       <div class="home">
         <h1>Quizzes</h1>
         <ul>
           <li><a href="/quiz?id=ww2" data-link>World War II Quiz</a></li>
           <li><a href="/quiz?id=ancient" data-link>Ancient Civilizations Quiz</a></li>
           <li><a href="/quiz?id=code" data-link>JavaScript Basics Quiz</a></li>
           <li><a href="/quiz?id=history" data-link>History Quiz</a></li>
         </ul>
         <a href="/about" data-link class="home__about-link">About Quizkit</a>
       </div>
     `;
   }
   ```

## Troubleshooting

### Common Issues

1. **Server Shows Directory Listing Instead of `index.html`:**

   - **Cause:** The server isn't serving `index.html` as the default file.
   - **Solution:** Ensure you're starting the server in the root directory (`quizkit-app`) where `index.html` is located.

2. **"Return to Home" Button Doesn't Work:**

   - **Cause:** Event listener for the button isn't set up correctly.
   - **Solution:** Ensure the event listener in `app/main.js` correctly targets the `#retry-button` and navigates to `'/'`.

3. **Rich Content Not Displaying Properly:**

   - **Cause:** Incorrect paths to media files or missing `content` fields in the quiz JSON.
   - **Solution:** Verify that media files are correctly placed in the `/app/images/` directory and that the `content` field in the JSON matches the desired format.

4. **Syntax Highlighting Not Working for Code Snippets:**

   - **Cause:** Prism.js is not correctly included or the language component is missing.
   - **Solution:** Ensure Prism.js and the necessary language components are included in `index.html`.

### Steps to Resolve Issues

1. **Check the Browser Console:**

   - Open Developer Tools (F12 or right-click > Inspect).
   - Look for any error messages that can hint at the problem.

2. **Verify File Paths:**

   - Ensure all file paths in your quiz JSON and HTML files are correct.
   - Relative paths should be accurate based on your project structure.

3. **Clear Browser Cache:**

   - Sometimes, old versions of files are cached. Clear the cache or use an incognito/private window to test.

4. **Ensure Proper JSON Formatting:**

   - Invalid JSON can cause quizzes not to load. Use a JSON validator to check your quiz files.

5. **Restart the Server:**

   - After making changes, restart your local server to ensure all updates are loaded.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Happy Quizzing!** 🎉

If you encounter any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.