
const webdriver = require('selenium-webdriver');
const { until } = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const chai = require('chai');
chai.use(require('chai-url'));
const assert = require('assert');
const { waitForDebugger, url } = require('inspector');
const { urlContains } = require('selenium-webdriver/lib/until');
const credentials = require('../../credentials.json');



//All of these test cases pass except for the remember me checkbox
describe('Login', () => {
    let driver;

    beforeEach(async () => {
      driver = new webdriver.Builder().forBrowser(process.env.BROWSER)
      .build();

      await driver.get(`${process.env.BASE_URL}/login`);
    }, 10000);
  
    afterEach(async () => {
      await driver.close();
    }, 10000);
  
    it('Login to Hudl Happy Path', async () => {

      const emailInputBox = driver.findElement(By.css("input[data-qa-id='email-input']"));
      const passwordInputBox = driver.findElement(By.css("input[data-qa-id='password-input']"));
      const loginButton = driver.findElement(By.css("button[data-qa-id='login-btn']"));

      await emailInputBox.sendKeys(credentials.email);
      await passwordInputBox.sendKeys(credentials.password);
      await loginButton.click();

      await driver.wait(until.urlContains('home'));

      const homePageGlobalNav = driver.findElement(By.css("[data-qa-id='webnav-globalnav-home']"));
      await driver.wait(until.elementLocated(By.css("[data-qa-id='webnav-globalnav-home']")));
      
      assert.doesNotThrow(() => { 
        homePageGlobalNav;
      });

    }, 10000);

    it('Unable to Login to Hudl - Incorrect Password', async () => {

      const emailInputBox = driver.findElement(By.css("input[data-qa-id='email-input']"));
      const passwordInputBox = driver.findElement(By.css("input[data-qa-id='password-input']"));
      const loginButton = driver.findElement(By.css("button[data-qa-id='login-btn']"));

      await emailInputBox.sendKeys(credentials.email);
      await passwordInputBox.sendKeys('WrongPassword');
      await loginButton.click();

      const errorDisplayContainer = await driver.wait(until.elementLocated(By.css("[class*='errorDisplayInnerContainer']")));
      
      assert.doesNotThrow(() => { 
        errorDisplayContainer;
      });

      await driver.wait(until.urlContains('login'));

    }, 10000);

    it('Unable to Login to Hudl - User Does Not Have Account', async () => {

      const emailInputBox = driver.findElement(By.css("input[data-qa-id='email-input']"));
      const passwordInputBox = driver.findElement(By.css("input[data-qa-id='password-input']"));
      const loginButton = driver.findElement(By.css("button[data-qa-id='login-btn']"));

      await emailInputBox.sendKeys('wrongEmail@gmail.com');
      await passwordInputBox.sendKeys(credentials.password);
      await loginButton.click();

      const errorDisplayContainer = await driver.wait(until.elementLocated(By.css("[class*='errorDisplayInnerContainer']")));
      
      assert.doesNotThrow(() => { 
        errorDisplayContainer;
      });

      await driver.wait(until.urlContains('login'));

    }, 10000);

    it('Unable to Login to Hudl - Invalid Email Format', async () => {

      const emailInputBox = driver.findElement(By.css("input[data-qa-id='email-input']"));
      const passwordInputBox = driver.findElement(By.css("input[data-qa-id='password-input']"));
      const loginButton = driver.findElement(By.css("button[data-qa-id='login-btn']"));

      await emailInputBox.sendKeys(credentials.user);
      await passwordInputBox.sendKeys(credentials.password);
      await loginButton.click();

      const errorDisplayContainer = await driver.wait(until.elementLocated(By.css("[class*='errorDisplayInnerContainer']")));
      
      assert.doesNotThrow(() => { 
        errorDisplayContainer;
      });

      await driver.wait(until.urlContains('login'));

    }, 10000);

    it('Verify user can navigate to reset password page', async () => {

      const needHelpButton = driver.findElement(By.css("[data-qa-id='need-help-link']"));
      await needHelpButton.click();

      const resetPasswordHeadline = await driver.wait(until.elementLocated(By.css("[data-qa-id='lets-reset-password-headline']")));
      
      assert.doesNotThrow(() => { 
        resetPasswordHeadline;
      });

    }, 10000);

    it('Verify user can navigate to signup page', async () => {

      const signUpButtonLink = driver.findElement(By.css("[class*='signUpLink']"));
      await signUpButtonLink.click();

      await driver.wait(until.urlContains('signup'));
      const loginButtonLink = await driver.wait(until.elementLocated(By.css("[data-qa-id='login']")));
      
      assert.doesNotThrow(() => { 
        loginButtonLink;
      });

    }, 10000);

    it('Verify user can navigate to back to landing page', async () => {

      const backButtonLink = driver.findElement(By.css("[class*='backIcon']"));
      await backButtonLink.click();

      const loginButtonLink = await driver.wait(until.elementLocated(By.css("[data-qa-id='login']")));
      
      assert.doesNotThrow(() => { 
        loginButtonLink;
      });

    }, 10000);

    it('Verify user can navigate to login as organization page', async () => {

      const loginAsOrgButton = driver.findElement(By.css("[data-qa-id='log-in-with-organization-btn']"));
      await loginAsOrgButton.click();

      await driver.wait(until.urlContains('login/organization'));

      const currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, 'https://www.hudl.com/app/auth/login/organization');

    }, 10000);

    //This test case fails since the user is not remembered when attempting to login the second time around
    it('Remember Me Checkbox - Verify User Is Remembered', async () => {

      let emailInputBox = driver.findElement(By.css("input[data-qa-id='email-input']"));
      const passwordInputBox = driver.findElement(By.css("input[data-qa-id='password-input']"));
      const loginButton = driver.findElement(By.css("button[data-qa-id='login-btn']"));
      const rememberMeCheckBox = driver.findElement(By.css("[data-qa-id='remember-me-checkbox-label']"));

      await emailInputBox.sendKeys(credentials.email);
      await passwordInputBox.sendKeys(credentials.password);
      await loginButton.click();
      await rememberMeCheckBox.click();

      await driver.wait(until.urlContains('home'));
      await driver.wait(until.elementLocated(By.css("[data-qa-id='webnav-globalnav-home']")));

      const homePageGlobalUserMenu = driver.findElement(By.css("[class='hui-globalusermenu']"));
      await homePageGlobalUserMenu.click();
      const homePageGlobalUserMenuLogout = driver.findElement((By.css("[data-qa-id='webnav-usermenu-logout']")));
      await homePageGlobalUserMenuLogout.click();

      await driver.wait(until.elementLocated(By.css("[data-qa-id='login']")));

      const landingPageLoginButton = driver.findElement(By.css("[data-qa-id='login']"));
      await landingPageLoginButton.click();

      await driver.wait(until.urlContains('login'));
      await driver.wait(until.elementLocated(By.css("[data-qa-id='email-input']")));

      const emailInputBoxText = await driver.findElement(By.css("input[data-qa-id='email-input']")).getAttribute("value");
      assert.equal(emailInputBoxText, credentials.email);

    }, 10000);

  });
