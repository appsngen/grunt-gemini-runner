# grunt-gemini-runner

> A grunt plugin to run Gemini tests.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gemini-runner --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gemini-runner');
```

## The "gemini-runner" task

### Overview
In your project's Gruntfile, add a section named `gemini-runner` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gemini-runner: {

    your_target: {
        options: {
          // Task-specific options go here.
        },
    },
  },
});
```

### Options

#### options.task
Type: `String`
Default value: `'test'`

A string value that is used to defined starts test or update tasks.

#### options.config
Type: `String`
Default value: `'.gemini.yml'`

A string value that is used to define config files.

#### options.reporter
Type: `String`

A string value that is used to determine whether the report was created on the test results.

#### options.local
Type: `Boolean`

A string value that is used to determine whether the test is carried out locally or using a Cloud service.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
'gemini-runner': {
    'local-update': {
        options: {
            task: 'update',
            config: '.gemini-local.yml',
            local: true
        }
    }
}
```