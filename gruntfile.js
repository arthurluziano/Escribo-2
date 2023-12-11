/* eslint-disable indent */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            my_target: {
                files: {
                    "dest/scripts.min.js": [
                        "server.js"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("publish", ["uglify"]);

};