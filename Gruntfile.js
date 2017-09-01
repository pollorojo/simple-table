'use strict';

module.exports = function(grunt)
{

    function getVersion() {
        return grunt.file.readJSON('./bower.json').version;
    }

    function banner() {
        return '/*\n' +
            ' * Simple Table\n' +
            ' * https://github.com/pollorojo/simple-table\n' +
            ' * @license MIT\n' +
            ' * v' + getVersion() + '\n' +
            ' */\n' +
            '(function (window, angular, undefined) {\n\'use strict\';\n\n';
    }

    grunt.initConfig({

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: {
                    'dist/ng-simple-table.js': [
                        'src/**/*.js'
                    ]
                }
            }
        },

        concat: {
            options: {
                banner: banner(),
                footer: '\n\n})(window, angular);',
                separator: '\n\n'
            },
            build: {
                files: {
                    'dist/ng-simple-table.js': ['dist/ng-simple-table.js']
                }
            }
        },

        injector: {
            options: {
                relative: false
            },
            local_dependencies: {
                files: {
                    'examples/index.html': [
                        'src/*.js',
                        'src/directives/*.js'
                    ]
                }
            }
        },

        wiredep: {
            dev: {
                devDependencies: true,
                src: ['examples/index.html'],
                ignorePath:  /\.\./
            }
        },

        uglify: {
            options: {
                mangle: false,
                preserveComments: false,
            },
            dist: {
                files: {
                    'dist/ng-simple-table.min.js': ['dist/ng-simple-table.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ['wiredep:dev', 'injector']);
    grunt.registerTask('dist', ['ngAnnotate', 'concat', 'uglify']);
};