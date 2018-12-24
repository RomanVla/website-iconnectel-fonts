
var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        template: {
            previewFileName: 'ic-icons-preview'
        },

        pkg: grunt.file.readJSON('package.json'),

        webfont: {
            glyphs: {
                src: 'src/vectors/*.svg',
                dest: 'dest/fonts',
                destCss: 'dest',
                options: {
                    types: 'eot,woff2,woff,ttf,svg',
                    rename: function (name) {
                        return path.basename(name).toLowerCase();
                    },
                    stylesheets: ['scss', 'css'],
                    font: 'ic-icons',
                    fontFilename: 'ic-icons-{hash}',
                    hashes: false,
                    htmlDemo: true,
                    destHtml: 'dest',
                    htmlDemoFilename: '<%= template.previewFileName %>',
                    htmlDemoTemplate: 'src/<%= template.previewFileName %>-template.html',
                    templateOptions: {
                        baseClass: 'ic-icon',
                        classPrefix: 'ic-'
                    },
                }
            }
        },

        clean: ['dest'],

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'dest/',
                    dest: 'dest/',
                    src: 'ic-icons-preview.html',
                    rename: function (dest, src) {
                        return dest + src.replace('.html', '.php');
                    }
                }]
            }
        },

        rewrite: {
            reviewHtml: {
                src: 'dest/<%= template.previewFileName %>.html',
                editor: function(contents, filePath) {
                    return contents.replace('<!--@@FileHead-->', '<link rel="stylesheet" id="iconnectel-styles-css" href="ic-icons.css" type="text/css" media="all">');
                }
            },
            reviewPHP: {
                src: 'dest/<%= template.previewFileName %>.php',
                editor: function(contents, filePath) {
                    return contents.replace('<!--@@FileHead-->', '<?php\n' +
                        '/*\n' +
                        '* Template Name: Icons Preview\n' +
                        '* */\n' +
                        'get_header();\n' +
                        '?>\n');
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['clean', 'webfont', 'copy', 'rewrite']);

};
