[![Build Status](https://app.bitrise.io/app/9477d3f47782ace9/status.svg?token=yuy5aC1nmPlz1rsMx7YuKA&branch=master)](https://app.bitrise.io/app/9477d3f47782ace9) [![npm version](https://badge.fury.io/js/aye-spy.svg)](https://badge.fury.io/js/aye-spy)

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
    "scenarios": [
      {
        "url": "http://thetimes.co.uk/",
        "label": "homepage",
        "cropToSelector": ".flickity-slider", // crop the screenshot to a specific selector
        "removeSelectors": ["#ad-header"], // remove elements that are not static on refresh such as adverts
        "viewports": [{"height": 2400, "width": 1024, "label": "large"}],
        "cookies": [
          {
            "name": "cookie_name",
            "value": "cookie_value"
          }
        ],
        "waitForSelector": "#section-news", // explicitly wait for a selector to be visible before snap
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

## Mobile Emulator

For scenarios where you need to use a mobile emulator, pass in the device name to the property `mobileDeviceName` on your config. Note that at the moment, this will only work with the chrome browser.

## Running

Take the latest screenshots for comparison:

`ayespy snap --browser chrome --config config.json --remote`

Set your latest screenshots as the baselines for future comparisons:

`ayespy update-baseline --browser chrome --config config.json --remote`

Run the comparison between baseline and latest:

`ayespy compare --browser chrome --config config.json --remote`

Run a single scenario based on label name:

`ayespy snap --browser chrome --config config.json --remote --run "scenarioName"`

Set a limit on how many parallel scenarios you can run:

`ayespy snap --browser chrome --config config.json --remote --gridLimit=5`

## Visual Regression Tips and Tricks

To make your visual regression tests as robust as possible there are a few points to consider.

  - Data: Wherever you run ayespy you need to have complete ownership of data. Along with the ability to refresh the data back to a consistent state
  - Dynamic elements: elements such as ads, videos, anything that moves should removed using the `removeSelectors` array. You want your page under test to be static.
  - The application under test: ayespy is really effective when loading a page and screenshotting. You start to loose that value when you perform complicated setup journeys such as going through a checkout. Although possible with `onReadyScript` this should only be used for cases such as closing a cookie message.
  - The selenium grid: We recommend using the container versions of selenium available from dockerhub. This ensures repeatable consistent state across test runs.

