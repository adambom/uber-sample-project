module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            less: {
                files: ['web/src/styles/**/*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['web/src/scripts/**/*.js'],
                tasks: ['include']
            },
            templates: {
                files: ['web/src/templates/**/*.html'],
                tasks: ['templates:dev']
            },
            copy: {
                files: ['web/src/fonts/**/*', 'web/src/img/**/*', 'web/src/swf/**/*', 'web/src/scripts/vendor/**/*'],
                tasks: ['copy']
            },
            imagemin: {
                files: ['web/src/img/**/*.{jpg,jpeg,png}'],
                tasks: ['imagemin:dev']
            }
        },
        copy: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'web/src/img/',
                    src: ['**/*.{svg,gif,png,ico}'],
                    dest: 'static/img/'
                }, {
                    expand: true,
                    cwd: 'web/src/scripts/',
                    src: ['**/*.js'],
                    dest: 'static/js/'
                }]
            }
        },
        imagemin: {
            dev: {
                options: {
                    optimizationLevel: 0
                },
                files: [{
                    expand: true,
                    cwd: 'web/src/img/',
                    src: ['**/*.{jpg,jpeg,png}'],
                    dest: 'web/static/img/'
                }]
            },
            production: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'web/src/img/',
                    src: ['**/*.{jpg,jpeg,png}'],
                    dest: 'web/static/build/img/'
                }]
            }
        },
        less: {
            dev: {
                files: {
                    'static/css/app.css': 'web/src/styles/app.less'
                }
            },
            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    'static/css/app.min.css': 'web/src/styles/app.less'
                }
            }
        },
        templates: {
            dev: {
                options: {
                    namespace: 'UBER',
                    prettify: false
                },
                files: {
                    'static/js/templates.js': 'web/src/templates/**/*.html'
                }
            },
            production: {
                options: {
                    namespace: 'UBER',
                    prettify: true
                },
                files: {
                    'build/templates.js': 'web/src/templates/**/*.html'
                }
            }
        },
        scripts: {
            libs: [
                'web/src/scripts/vendor/lodash/lodash-1.3.1.js',
                'web/src/scripts/vendor/backbone/backbone-1.0.0.js',
                'web/src/scripts/vendor/jquery/jquery-ui-1.10.3.custom.js',
                'web/src/scripts/backbone.calculated/namespace.js',
                'web/src/scripts/backbone.calculated/**/*.js'
            ],
            src: [
                'web/src/scripts/templates.js',
                'web/src/scripts/models/base-model.js',
                'web/src/scripts/models/query-model.js',
                'web/src/scripts/collections/queryable-collection.js',
                'web/src/scripts/**/*.js'
            ]
        },
        include: {
            dev: {
                src: [
                    '<%= scripts.libs %>',
                    '<%= scripts.src %>'
                ],
                dest: 'templates/scripts.html'
            }
        },
        concat: {
            production: {
                src: [
                    '<%= scripts.libs %>',
                    'web/src/helpers/closure-header.js',
                    'build/templates.js',
                    '<%= scripts.src %>',
                    'web/src/helpers/closure-footer.js'
                ],
                dest: 'build/main.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            production: {
                files: {
                    'static/js/main.min.js': [
                        'build/main.js'
                    ]
                }
            }
        }
    });

    grunt.registerMultiTask('templates', 'Compiles underscore templates', function () {
        var _ = require('lodash');
        var options = this.options({
            separator: grunt.util.linefeed,
            templateSettings: {},
            templateNamespace: 'tmpl'
        });

        function getNamespace(ns) {
            var output = [];
            var curPath = 'App';
            if (ns !== 'App') {
                var nsParts = ns.split('.');
                nsParts.forEach(function(curPart, index) {
                    if (curPart !== 'App') {
                        curPath += '[' + JSON.stringify(curPart) + ']';
                        output.push(curPath + ' = ' + curPath + ' || {};');
                    }
                });
            }

            return {
                namespace: curPath,
                declaration: output.join('\n')
            };
        }

        this.files.forEach(function (f) {
            var namespaces = [];
            var output = f.src.filter(function (path) {
                if (!grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (path) {
                var src = grunt.file.read(path);
                var parts = path.match(/.+\/(?:template|tmpl)(?:s)?\/(.+).html/i)[1].split('/');
                var ns = _.initial(parts).join('.').replace(/(-.)/g, function () {
                    return arguments[0].substring(1).toUpperCase();
                });
                var name = _.last(parts).replace(/(-.)/g, function () {
                    return arguments[0].substring(1).toUpperCase();
                });
                var nsInfo = getNamespace(_.compact([options.templateNamespace, ns]).join('.'));
                var compiled;

                try {
                    compiled = _.template(src, false, options.templateSettings).source;
                } catch (e) {
                    grunt.log.error(e);
                    grunt.fail.warn('_.template failed to compile in file "' + filepath + '"');
                }

                if (options.prettify) {
                    compiled = compiled.replace(new RegExp('\n', 'g'), '');
                }

                namespaces = [].concat(namespaces, nsInfo.declaration.split('\n'));

                return nsInfo.namespace + '["' + name + '"] = ' + compiled + ';';
            });

            if (output.length < 1) {
                grunt.log.warn('Destination not written because compiled files were empty.');
            } else {
                if (options.templateNamespace !== false) {
                    output.unshift(_.uniq(namespaces).join('\n'));
                }

                output.unshift('(function (App, undefined) {');
                output.push('})( this["' + options.namespace + '"]);');

                grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
                grunt.log.writeln('File "' + f.dest + '" created.');
            }
        });

    });

    grunt.registerMultiTask('include', 'Inserts all required script tags into the html at a special marked insertion point', function () {
        var _ = require('lodash');
        var options = this.options({
            separator: grunt.util.linefeed,
            attributes: '',
            webRoot: 'web/src/scripts'
        });
        var reRoot = new RegExp('^' + options.webRoot);

        this.files.forEach(function (f) {
            var output = f.src.filter(function (path) {
                if (!grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (path) {
                return _.compact(['<script', options.attributes, 'src="' + path.replace(reRoot, 'static/js') + '"></script>']).join(' ');
            });

            if (output.length < 1) {
                grunt.log.warn('Destination not written because compiled files were empty.');
            } else {
                grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
                grunt.log.writeln('File "' + f.dest + '" created.');
            }
        });

    });

    // Default task.
    grunt.registerTask('default', ['imagemin:dev', 'copy', 'templates:dev', 'less:dev', 'include', 'watch']);
    grunt.registerTask('production', ['copy', 'imagemin:production', 'templates:production', 'concat', 'uglify:production', 'less:production']);
};