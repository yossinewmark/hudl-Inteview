# Hudl Interview Automation Suite

This suite uses MochaJS and Selenium Webdriver to test the login behavior for https://www.hudl.com

## Setup:
_Browser Support_
- By default, this test suite uses Safari as it's webdriver, which can be enabled in the command line using the following command:  `/usr/bin/safaridriver --enable`. If the user is using a device that does not support Safari, s/he can install a webdriver of choice (e.g. chrome, firefox, etc...), and modify the `BROWSER` constant in the `.env` file to the webdriver of choice.

_Installation_
- In order to install the test suite, simply clone the repository to your local machine and run `npm install` in the root directory. This should install all of the necessary dependencies for the project.

_Credentials File_
- Prior to running the tests, you will need to modify the `credentials.json` file to include your username and password. By default it is set to the following:

        {
          "user": "john.doe",
          "email": "john.doe@gmail.com"
          "password": ""
        }

### Running the Tests
- In order to run the login tests, run the following command in the project root directory in order to kickoff the test command script defined in the package.json: 
    `npm test src/tests/login.spec.js` 
- The default timeout is set to 10 seconds for each command, which can be modified in the test command script in the `package.json` file.