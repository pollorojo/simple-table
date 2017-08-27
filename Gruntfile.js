'use strict';

module.exports = function(grunt)
{
    grunt.initConfig({
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
        }
    });

    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('default', ['wiredep:dev', 'injector']);
};