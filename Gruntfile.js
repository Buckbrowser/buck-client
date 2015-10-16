module.exports = function(grunt) {
	var bootstrapURL = 'node_modules/bootstrap/';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
		    dist: {
		      src: ['js/main.js','js/**','!js/app.js'],
		      dest: 'js/app.js',
		    }
		},
		watch: {
			options: {
				livereload: true
			},
			scripts: {
				files: ['js/**','!js/app.js'],
				tasks: ['concat']
			},
			bootstrap: {
				files: [bootstrapURL+'less/**'],
				tasks: ['less','cssmin']
			},
			styles: {
				files: ['css/*']
			},
			templates: {
				files: ['templates/*']
			},
			index: {
				files: ['index.html']
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'css/',
					src: 'bootstrap.css',
					dest: 'css/',
					ext: '.min.css'
				}]
			}
		},
		copy: {
			fonts: {
	        expand: true,
	        src: bootstrapURL+'fonts/*',
	        dest: 'fonts/',
	        flatten: true
	      },
		},
		connect: {
			server: {
				options: {
					livereload: true,
					open: true
				}
			}
		},
		less: {
			compileCore: {
		        options: {
		          strictMath: true
		        },
		        src: bootstrapURL+'less/bootstrap.less',
		        dest: 'css/bootstrap.css'
			}
		}
	});

	grunt.registerTask('server', ['concat','less','cssmin','copy','connect','watch']);
	grunt.registerTask('default', ['concat','less','cssmin','copy']);

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
};