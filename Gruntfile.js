module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
		    options: {
		      separator: '',
		    },
		    dist: {
		      src: ['js/main.js', 'js/Controllers/*', 'js/Services/*', 'js/Filters/*'],
		      dest: 'js/app.js',
		    }
		},
		watch: {
			files: ['js/main.js', 'js/Controllers/*', 'js/Services/*', 'js/Filters/*'],
			tasks: ['concat'],
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat']);
};