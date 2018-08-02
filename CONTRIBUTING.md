### Submitting an Issue
Before you submit your issue please search the issue archive

If your issue appears to be a bug, providing the following information will increase the chances of your issue being dealt with quickly:

Overview of the Issue - if an error is being thrown a non-minified stack trace helps
Motivation for or Use Case - explain why this is a bug for you
Browsers and Operating System - is this a problem with all browsers or only specific ones?
Reproduce the Error - provide a live example
Related Issues - has a similar issue been reported before?

### Submitting a Pull Request
Testing
Ensure every new module has sufficient testing in place, ideally aiming for 100% coverage where possible.

Where appropriate (i.e. new features) there should also be a new e2e example created

On submitting a PR all unit, integration and e2e tests will run. If a failure occurs your PR will not be approved.

Commit messages
When committing please follow the set convention below:

feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing or correcting existing tests
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation


Aye Spy uses an auto publishing feature that uses this commit convention to work out the bump version.