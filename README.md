# Aye Spy
### Aye Spy with my little eye... a visual regression!

![](https://s3-eu-west-1.amazonaws.com/aye-spy/ayespy.jpg)

Aye spy is a high performance visual regression tool. Created to fit in with your cloud infrastructure and distribute tests using selenium grid for huge performance gains.

In order to get the most out of Aye Spy we recommend using a selenium grid and cloud storage (currently supporting Amazon S3). However if you wish to run locally that is also supported but the performance gains will be less significant.


## Inspiration

We have taken inspiration for this project from existing projects such as Wraith and BackstopJs. 

Visual regressions testing is a great tool to have in your pipeline but the current solutions on the market were missing one key component we felt was essential for a great developer experience... performance!

With the correct set up you can expect your tests using aye-spy to take under a minute.

![](https://s3-eu-west-1.amazonaws.com/aye-spy/ayespy-running.gif)

## Setup

To install the package:

```npm i -g aye-spy```

In order to use the remote functionality you will need to export some aws credentials:

```
export AWS_SECRET_ACCESS_KEY=secretkey
export AWS_ACCESS_KEY_ID=keyid
```

Create an S3 bucket to store your images.

Example cofig:

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
        "removeSelectors": ["#ad-header"],
        "viewports": [{"height": 2400, "width": 1024, "label": "large"}],
        "cookies": [
          {
            "name": "cookie_name",
            "value": "cookie_value"
          }
        ],
        "waitForSelector": ["#section-news"]
      }
    ]
  }
  ```


## Running

Take the screenshots for comparison:

`ayespy snap --browser chrome --config config.json --remote`

Set your most recent screenshots as the baselines for future comparisons:

`ayespy update-baseline --browser chrome --config config.json --remote`

Run the comparison:

`ayespy compare --browser chrome --config config.json --remote`

Generate the comparison report: 

`ayespy generate-report --browser chrome --config config.json --remote`


