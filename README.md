[![Build Status](https://travis-ci.org/modern-mean/core-server.svg?branch=master)](https://travis-ci.org/modern-mean/core-server)
[![Coverage Status](https://coveralls.io/repos/github/modern-mean/core-server/badge.svg?branch=master)](https://coveralls.io/github/modern-mean/core-server?branch=master)

# core-server
Module for the core server.  Can be used as a web server or api server

# Installation
To install this module
```sh
npm install --save modern-mean/core-server
```

# Configuration
To configure this module you can override the environment variables from https://github.com/modern-mean/core-server/blob/master/src/server/config/server.js

# Development
If you want to develop with this module you should not have it installed!  Remove it if it is currently installed.
```sh
rm -rf node_modules/modern-mean-core-server
```
You should fork this module and clone your fork into the moduledev folder.
```sh
git clone <YOUR_FORK_URL> moduledev/modern-mean-core-server
//Example git clone https://github.com/trainerbill/core-server.git moduledev/modern-mean-core-server
```
