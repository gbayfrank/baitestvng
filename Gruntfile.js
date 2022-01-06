module.exports = function(grunt) {

    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Define Path
		dirs: {
			input				: 'development',
			inputSCSS			: 'development/sass',
			inputJS				: 'development/js',
			inputHTMLELements	: 'development/html-elements',
			output				: 'production',
			outputCSS			: 'production/css',
			outputJS			: 'production/js',
		},

		// Plugin copy
		copy: {
			main: {
				expand: true,
				cwd: 'development/images',
				src: '**',
				dest: 'production/images',
			},
		},

        // Plugin 01: CSSmin
		cssmin: {
			options: {
			},
			target: {
				files: {
					'<%= dirs.outputCSS %>/main.css' : '<%= dirs.outputCSS %>/main.css'
				}
			}
		},

		// Plugin 02: Uglify
		uglify: {
			options: {
				beautify: false,
				compress: {
					drop_console: false
				}
			},
			my_target: {
		  		files: {
		  			'<%= dirs.outputJS %>/app.min.js': [
                        '<%= dirs.inputJS %>/uikit.js', 
                        '<%= dirs.inputJS %>/uikit-icons.js', 
                        '<%= dirs.inputJS %>/app.js'
                    ]
		  		}
			}
		},

        // Plugin 03: Sass
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    '<%= dirs.outputCSS %>/main.css' : '<%= dirs.inputSCSS %>/main.scss'
                }
            }
        },

		// Plugin 04: watch
		watch: {
			scripts: {
				files: [
					'<%= dirs.inputSCSS %>/*.scss',				// development/sass/*.scss
					'<%= dirs.inputSCSS %>/*/*.scss',			// development/sass/*/*.scss
					'<%= dirs.inputJS %>/*.js',	
					'<%= dirs.input %>/index.html',
					'<%= dirs.inputHTMLELements %>/*.html',		// development/html-elements/*.html
					//'<%= dirs.inputHTMLELements %>/*/*.html',	// development/html-elements/*/*.html
				],
				tasks: ['copy', 'sass', 'includes', 'uglify'  ],
				options: {
					spawn: false,
					livereload: true
				},
			},
		},

		// Plugin 05: connect
		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: 8888,
					base: '<%= dirs.output %>/',
					livereload: true
				}
			}
		},

		// Plugin 06: includes
		includes: {
			files: {
				src: [
					'<%= dirs.input %>/index.html'
				], // Source files
				dest: '<%= dirs.output %>/',
				flatten: true,
				cwd: '.',
				options: {
			  		silent: true,
			  		banner: ''
				}
			}
		},

		// HTML MIN
		htmlmin: {                                     // Task 
			dist: {                                      // Target 
				options: {                                 // Target options 
					removeComments: false,
					collapseWhitespace: true
				},
				files: {                                   // Dictionary of files 
					'<%= dirs.output %>/index2.html': '<%= dirs.output %>/index.html',
				}
			},
		}
    });
  
    // Load the plugin
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-contrib-connect');
  	grunt.loadNpmTasks('grunt-includes');
  	grunt.loadNpmTasks('grunt-contrib-htmlmin');

  
    // 03 Register task(s).
	grunt.registerTask('default', 'Log some stuff.', function() {
		grunt.log.write('Logging some stuff...').ok();
	});

	// Task Developer
	grunt.registerTask('dev', [
		'copy',
		'includes',
		'sass',
		'uglify',
		'connect',
		'watch',
	]);

	// Task Publish Project
	grunt.registerTask('publish', [
		'cssmin',
		'uglify',
		'htmlmin'
	]);
  
  };