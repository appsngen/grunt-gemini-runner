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
        var path = require('path');
        var options = this.options();
        var directory = '.';
        var cmd = 'gemini';
        var phantomCmd = /^win/.test(process.platform) ? 'phantomjs.cmd' : 'phantomjs';
        var next = this.async();
        var args = [];
        var polyServeModule = require('../../polyserve/lib/start_server.js');
        var gemini, phantom, polyServer, polyServerOptions;
        var phantomjsCommand;

        var getPhantomJsExecutable = function (callback) {
            var command;

            if (process.platform === 'win32') {
                grunt.util.spawn({
                    cmd: 'where',
                    args: ['phantomjs.cmd']
                }, function (err, result, code) {
                    if (err) {
                        grunt.log.error(err, code);
                        next(err);
                    } else {
                        command = result && result.stdout &&
                            path.join(path.dirname(result.stdout), 'node_modules\\phantomjs\\bin\\phantomjs');
                        callback(null, command, code);
                    }
                });
            } else {
                if (process.platform !== 'linux') {
                    grunt.log.error('Platform ' + process.platform + ' is not supported and wasn\'t tested.\n' +
                        'Trying to use as linux based distribution.');
                }

                grunt.util.spawn({
                    cmd: 'which',
                    args: ['phantomjs']
                }, function (err, result, code) {
                    if (err) {
                        grunt.log.error(err, code);
                        next(err);
                    } else {
                        command = result && result.stdout;
                        callback(null, command, code);
                    }
                });
            }
        };

        var runPhantomjs = function (jsFile, directory) {
            return grunt.util.spawn({
                cmd: 'node',
                args: [jsFile, '--webdriver=4444'],
                opts: {
                    cwd: directory
                }
            }, function (err, result, code) {
                if (err) {
                    grunt.log.error(err, code);
                    next(err);
                }
            });
        };

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
            getPhantomJsExecutable(function (err, result, code) {
                if (err) {
                    grunt.log.error(err, code);
                    next(err);
                } else {
                    phantom = runPhantomjs(result, directory);

                    if (typeof phantom === 'undefined') {
                        grunt.fail.fatal('PhantomJS task failed.');
                    }
                }
            });
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
            if (phantom) {
                phantom.kill();
            }

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
