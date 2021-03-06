## Here's a list of key terms in *DashboardHub* and what they mean:

### Environment

Environment types. There can be more, these are the common types and common names.

| Type | Description |
| :--- | :--- |
| `dev` | Development environment where developers code integrates together for the first time (usually default branch on version control named `develop` |
| `test` | Test environment, where the wider team tests the new features of the software product |
| `staging` | Staging, also known as `pre-prod` that has production like data and final checks can be made |
| `prod` | Production is the live server that the clients / customers use on the internet |

### Releases

When you work on a piece of software, there will likely be many versions you create before you reach a version that you are ready to release to an environment (e.g. `dev`, `test`, `staging`, `prod`). A **release** is the final "product" that you build or deploy for a particular version. There will be many releases to the earlier environments and only a few make it to the later ones.

### State

There are several possible **states** that your release might be in at any one time, depending on your environment type:

| Possible states | Environment Type: Build Only | Environment Type: Deply Only | Environment Type: Build & Build Only |
| :--- | :--- | :--- | :--- |
| startBuild | ✅ | - | ✅ |
| finishBuild | ✅ | - | ✅ |
| failBuild | ✅ | - | ✅ |
| startDeploy | - | ✅ | ✅ |
| finishDeploy | - | ✅ | ✅ |
| failDeploy | - | ✅ | ✅ |

### Beacon

**Beaconing** data means to tell *DashboardHub* that the state of your release has changed. For example, if the version has just started to `deploy`, for example, you can **beacon** this data to *DasboardHub* by running a unique, auto-generated curl `startDeploy` command.

*How do I beacon data?*

In *DashboardHub*, there are three ways you can beacon data:

1) (Recommended) Copy & paste the auto-generated curl command to the corresponding part of your automated CI config file (this is the recommended method, as this makes beaconing entirely automated
2) Run the curl command on the command line
3) Manual release form, which is a easy-to-complete dropdown form that can be found on the releases page

### Continuous Integration (CI)

**CI** (Continuous Integration) for example: Travis CI, Circle CI, Gitlab CI, are services that could be integrated into your software build and / or deployment process. CI Services run various tasks for example automated tests that are run before changes are allowed to be integrated into the final build / deploy. If the changes fail these tests, they will not be integrated. If you place the corresponding curl commands at the correct stages of your build / deploy process in your CI config file (see above), data will be beaconed automatically to *DashboardHub*.

### Continuous Devlivery (CD)

**CD** (Continuous Delivery) is added to the final step on **CI** (see above) workflow. Once all the pre-flight checks are successful, the software product can be automatically be deployed to the relevant enviroment.

### Monitor

Within your environments, you can set up **monitors**, to keep an eye on the "health" of your environment. You must have at least one monitor on an environment before you can send "pings" to it (see below). Different monitors under the same environment will be needed if you are expecting your pings to provoke multiple different responses from your environment (e.g. your expected code may be `200`, `404` etc.)

### Pings

You can think of **pings** as "poking" your environment domain to see whether you get the response from the server that you expect. With *DashboardHub*, pings are *automatically* sent every 30 minutes from every monitor, and after every successful build / deploy. You can also *manually* send pings whenever you like. You will receive a notification whenever a ping returns as invalid. This functionality is useful in ensuring that everything is up and running as you expect, and to afford you the peace of mind that you will be notified immediately should your environment not be functioning as you expect it to.
