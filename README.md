[![Build Status](https://app.bitrise.io/app/9477d3f47782ace9/status.svg?token=yuy5aC1nmPlz1rsMx7YuKA&branch=master)](https://app.bitrise.io/app/9477d3f47782ace9) [![npm version](https://badge.fury.io/js/aye-spy.svg)](https://badge.fury.io/js/aye-spy)
[![Coverage Status](https://coveralls.io/repos/github/newsuk/AyeSpy/badge.svg?branch=master)](https://coveralls.io/github/newsuk/AyeSpy?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/newsuk/AyeSpy/badge.svg?targetFile=package.json)](https://snyk.io/test/github/newsuk/AyeSpy?targetFile=package.json)


# Aye Spy 🐛👀

## With my little eye...

### Brought to you by The Times Tooling team  🛠

Aye Spy is a high performance visual regression tool to catch UI regressions. 

![](https://i.imgur.com/3jQXR48.png)


## Inspiration

Aye Spy takes inspiration from existing projects such as [Wraith](https://github.com/BBC-News/wraith) and [BackstopJs](https://github.com/garris/BackstopJS).

We have found visual regression testing to be one of the most effective ways to catch regressions. It's a great tool to have in your pipeline, but the current solutions on the market were missing one key component we felt was essential for a great developer experience... performance!

With the correct set up you can expect 40 comparisons running under a minute.

![](https://s3-eu-west-1.amazonaws.com/aye-spy/ayespy-running.gif)


## Concept

The idea behind visual regression is essentially image comparison over time.

There are a set of 'visually correct' baseline images of your site.

As you make changes to your site Aye Spy will take new images.

Aye Spy will then compare the latest images against the baseline images.

If there are differences the build fails and a report will be generated.
This gives you the opportunity to check the differences are expected.

If they are expected, update the baseline images

## Setup

In order to get the most out of Aye Spy we recommend 

  - Using the [selenium images from docker hub](https://hub.docker.com/u/selenium/) for consistent repeatable state 
  - Cloud storage (currently supporting Amazon S3)



To install the package:

`npm i -g aye-spy`


    ayespy init 

Example config to run Aye Spy:

```
{
    "gridUrl": "http://selenium-grid:4444/wd/hub",
    "baseline": "./baseline", 
    "latest": "./latest",
    "generatedDiffs": "./generatedDiffs",
    "report": "./reports",
    "remoteBucketName": "aye-spy-example", 
    "remoteRegion": "eu-west-1",
    "limitAmountOfParallelScenarios": 10, // if you are killing your selenium grid use this to batch up scenarios
    "onBeforeSuiteScript": "./scripts/login.js", // run a script before the entire suite (this script takes no parameters)
    "scenarios": [
      {
        "url": "http://thetimes.co.uk/",
        "label": "homepage",
        "cropToSelector": ".flickity-slider", // crop the screenshot to a specific selector
        "removeElements": ["#ad-header"], // remove elements that are not static on refresh such as adverts
        "hideElements": [".is-delayedImage"] // hide elements that are not static on refresh such as adverts
        "viewports": [{"height": 2400, "width": 1024, "label": "large"}],
        "cookies": [
          {
            "name": "cookie_name",
            "value": "cookie_value"
          }
        ],
        "waitForElement": "#section-news", // explicitly wait for a selector to be visible before snap
        "onReadyScript": "./scripts/clickSelector.js", // run a script before snap
        "wait": 2000 // implicitly wait before taking a snap
      }
    ]
  }
```

## Using S3 Storage for images

In order to use the S3 Storage capabilities you will need to export some aws credentials:

```
export AWS_SECRET_ACCESS_KEY=secretkey
export AWS_ACCESS_KEY_ID=keyid
```

Create an S3 bucket to store your images. 
Make sure to configure the bucket policy to allow viewing of objects.

## on Ready Script

For scenarios where you need to interact with the page before taking a screenshot, a script can be run which has the [selenium-webdriver](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs) driver and By exposed. 

Only es5 is currently supported so please transpile.

Example script:

```
async function clickElement (browser, By) {
    await browser.wait(until.elementIsVisible(browser.findElement(By.css(utils.getFirstName()))), 10000);
    await browser.findElement(By.id("firstName")).sendKeys("Bobby");
    await browser.findElement(By.css(".dob-day-option-field")).sendKeys("10");
};

module.exports = clickElement;
```

## on Before Suite Script

In cases where you need to run a script once, before the entire suite is launched (e.g. setting up global objects or setting up external services), pass the path of the script into `onBeforeSuiteScript` in the config file.

Unlike the onReady and onBefore script options, onBeforeSuite script does not have a driver passed to it as an argument. Any external dependencies will need to be set up independantly inside the script. However the script does provide access to the config, so that you can read/modify values dynamically if needed.

## Mobile Emulator

For scenarios where you need to use a mobile emulator, pass in the device name to the property `mobileDeviceName` on your config. Note that at the moment, this will only work with the chrome browser.

## Running

### Supported Browsers: Firefox | Chrome

Take the latest screenshots for comparison:

`ayespy snap --browser chrome --config config.json --remote --branch branchName`

Set your latest screenshots as the baselines for future comparisons:

`ayespy update-baseline --browser chrome --config config.json --remote`

Run the comparison between baseline and latest:

`ayespy compare --browser chrome --config config.json --remote --branch branchName`

Run a single scenario based on label name:

`ayespy snap --browser chrome --config config.json --remote --run "scenarioName"`

## Visual Regression Tips and Tricks

To make your visual regression tests as robust as possible there are a few points to consider.

  - Data: Wherever you run Aye Spy you need to have complete ownership of data. Along with the ability to refresh the data back to a consistent state
  - Dynamic elements: elements such as ads, videos, anything that moves should removed using the `removeElements` or `hideElements` array.
    - `hideElements` - sets the opacity of the element to 0 and will not affect the positioning of other elements on the page.
    - `removeElements` - hard deletes the element from the Dom and may affect the positioning of other elements.
    
    You want your page under test to be static.
  - The application under test: Aye Spy is really effective when loading a page and screenshotting. You start to loose that value when you perform complicated setup journeys such as going through a checkout. Although possible with `onReadyScript` this should only be used for cases such as closing a cookie message.
  - The selenium grid: We recommend using the container versions of selenium available from dockerhub. This ensures repeatable consistent state across test runs.

## Running AyeSpy on specific branch

Running AyeSpy on branches will enable you to catch issues sooner. To do this you can specify the `--branch` parameter, which will create a subdirectory for your branch, allowing you to test independently of other branches.

*Note: this option creates extra directories containing screenshots on your S3 bucket, so it is recommended to set up a lifecycle policy to delete these when you are done with them.*


Take the latest screenshots for comparison on specific branch:

`ayespy snap --browser chrome --config config.json --remote --branch branchName`

Run the comparison between baseline and latest on specific branch:

`ayespy compare --browser chrome --config config.json --remote --branch branchName`

In this case `snap` will create latest folder in specific `branch` on S3 bucket and `compare` will compare results on this branch and compare it will baseline. Report will be saved in branch folder.


## Limitations 

As of yet Aye Spy does not support switching contexts to iFrames

## Running All Aye Spy Tests

Aye Spy comes packaged up with a comprehensive set of tests adhering to the test pyramid to give a high level of confidence that the application is working as expected.

### Unit & Integration tests

`yarn test`


### End to End Tests

Inside the e2eTest folder there are a number of scenarios covering Aye Spy end to end.

We use Docker to package Aye Spy and then Docker Compose to spin up dependencies such as a Selenium Grid and NGINX to host a test website (/testSite) for Aye Spy to interact with.

To run the e2e tests run 

`yarn test:e2e:build`

`yarn test:e2e:run`


## Contributing

[To contribute please checkout CONTRIBUTING](./CONTRIBUTING.md)
