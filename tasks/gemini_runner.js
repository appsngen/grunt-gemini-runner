/*
 * gemini-runner
 * https://github.com/appsngen/grunt-gemini-runner.git
 *
 * Copyright (c) 2014 AppsNgen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('gemini-runner', 'A grunt plugin to run Gemini tests.', function() {

        var options = this.options();
        var directory = '.';
        var cmd = 'gemini';
        var next = this.async();
        var args = [];
        var polyServeModule = require('../../polyserve/lib/start_server.js');
        var gemini, phantom, polyServer, polyServerOptions;

        if (options.task) {
            args.push(options.task);
        } else {
            args.push('test');
        }

        if (options.config) {
            args.push('--config', options.config);
        }

        if (options.reporter) {
            args.push('--reporter', options.reporter);
        }

        if (options.local) {
            phantom = grunt.util.spawn({
                cmd: 'phantomjs',
                args: ['--webdriver=4444'],
                opts: {
                    cwd: directory
                }
            }, function (err, result, code) {
                if (err) {
                    grunt.fail.fatal(err, code);
                    next(code);
                } else {
                    grunt.log.ok();
                    next();
                }
            });

            if (typeof phantom === 'undefined') {
                grunt.fail.fatal('PhantomJS task failed.');
            }
        }

        polyServerOptions = {
            root: process.cwd(),
            port: 8085,
            hostname: 'localhost'
        };

        polyServer = polyServeModule.startServer(polyServerOptions);

        gemini = grunt.util.spawn({
            cmd: cmd,
            args: args,
            opts: {
                cwd: directory
            }
        }, function (err, result, code) {
            if (err) {
                grunt.fail.fatal(err, code);
                next(code);
            } else {
                grunt.log.ok();
                next();
            }
        });

        if (typeof gemini === 'undefined') {
            grunt.fail.fatal('Gemini task failed.');
        }
        gemini.stdout.on('data', function (buf) {
            grunt.log.write(String(buf));
        });
        gemini.stderr.on('data', function (buf) {
            grunt.log.error(String(buf));
        });
    });

};
