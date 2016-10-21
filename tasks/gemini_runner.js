/*
 * gemini-runner
 * https://github.com/appsngen/grunt-gemini-runner.git
 *
 * Copyright (c) 2014 AppsNgen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('gemini_runner', 'A grunt plugin to run Gemini tests.', function() {

        var directory = '.';
        var cmd = 'gemini';
        var next = this.async();
        var gemini = grunt.util.spawn({
            cmd: cmd,
            args: argv?argv.split(','):['test'],
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
            grunt.fail.fatal(cmd + ' task failed.');
        }
        gemini.stdout.on('data', function (buf) {
            grunt.log.write(String(buf));
        });
        gemini.stderr.on('data', function (buf) {
            grunt.log.error(String(buf));
        });
    });

};
