
var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        myTemplate: {
            previewFileName: 'ic-icons-preview',
            fontName: 'ic-icon'
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
                    font: '<%= myTemplate.fontName %>s',
                    fontFilename: '<%= myTemplate.fontName %>s-{hash}',
                    hashes: false,
                    htmlDemo: true,
                    destHtml: 'dest',
                    htmlDemoFilename: '<%= myTemplate.previewFileName %>',
                    htmlDemoTemplate: 'src/<%= myTemplate.previewFileName %>-template.html',
                    templateOptions: {
                        baseClass: '<%= myTemplate.fontName %>',
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
                    src: '<%= myTemplate.previewFileName %>.html',
                    rename: function (dest, src) {
                        return dest + src.replace('.html', '.php');
                    }
                }]
            }
        },

        rewrite: {
            reviewHtml: {
                src: 'dest/<%= myTemplate.previewFileName %>.html',
                editor: function(contents, filePath) {
                    return contents.replace('<!--@@FileHead-->', '<link rel="stylesheet" id="iconnectel-styles-css" href="ic-icons.css" type="text/css" media="all">');
                }
            },
            reviewPHP: {
                src: 'dest/<%= myTemplate.previewFileName %>.php',
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
