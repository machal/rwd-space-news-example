/*
Grunt tasky
===========

1) CSS
2) Javascript
3) Obrazky
4) browserSync & watch
5) Alias tasky


*/

module.exports = function(grunt) {
  "use strict";

  // zjistujeme cas behu tasku
  require('time-grunt')(grunt);

  // jit-grunt pro zrychleni nacitani gruntu a behu tasku
  require('jit-grunt')(grunt);


  // Nastaveni tasku
  grunt.initConfig({

    // 1) CSS
    // ======

    // LESS kompilace
    // --------------

    less: {
      default: {
        files: {
          'dist/css/style.css': 'src/less/index.less'
        }
      },
      sourcemaps: {
        files: {
          'dist/css/style.css': 'src/less/index.less'
        },
        options: {
          sourceMap: true,
          // sourceMapFilename:
          // Pokud nastaveno, zapise se SM do
          // externiho souboru. Uvadi se zde cesta k nemu.
          sourceMapFilename: 'dist/css/style.css.map',
          // sourceMapURL:
          // Prepise vychozi url pro soubor se SM,
          // tak jak se vola na konci zkompilovaneho CSS souboru.
          // Vychozi je obsah `sourceMapFilename`, tady jde prepsat.
          sourceMapURL: 'style.css.map',
          // sourceMapRootpath:
          // Cesta k LESS souborum jek budou volany ze souboru se SM.
          sourceMapRootpath: '/',
          // Komprimovat?
          // TODO: komprimujeme timto jen proto, ze contrib-css odstranoval
          // sourcemapy
          //compress: true,
        }
      }
    },

    // Autoprefixer
    // ------------

    // Automaticky pridava browser prefixy co vykompilovaneho CSS.

    autoprefixer: {
      options: {
        browsers: ['last 3 versions', 'ios 6', 'ie 7', 'ie 8', 'ie 9'],
        map: true // Updatni SourceMap
      },
      style: {
          src: 'dist/css/style.css',
          dest: 'dist/css/style.css'
      }
    },

    // criticalcss TODO
    // -----------

    // Automaticky vytahuje kritický CSS kód (nad zlomem), který se má vložit do hlavičky
    // stránky jako inline.

    // criticalcss: {
    // },

    // CSSmin
    // ------

    // Minifikujeme inlinované CSSka.
    // Nepoužíváme na style.css, protože odstraňuje SourceMapy. Ale bylo
    // by to efektivnější než minifikovat LESSem. (TODO)

    cssmin: {
      inline_css: {
          files: [{
            expand: true,
            cwd: 'dist/css/critical/',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/css/critical/',
            ext: '.min.css'
          }]
        }
    },

    // 2) Javascript
    // =============

    // TODO

    // Concat: spojovani JS do jednoho
    // -------------------------------

    // concat: {
    //   // Inlinovany JS do hlavicky
    //   head: {
    //     src: [
    //       'src/js/index-head.js', // Nase detekce atd.
    //       'bower_components/picturefill/dist/picturefill.js', // Picturefill + matchmedia
    //       'bower_components/loadcss/loadCSS.js' // Asynchronni nacitani CSS
    //     ],
    //     dest: 'dist/js/script-head.js'
    //   },
    //   // Zbytek JS do paticky
    //   foot: {
    //     src: [
    //       'src/js/index.js',
    //     ],
    //     dest: 'dist/js/script.js'
    //   }
    // },

    // Uglify: pokrocila minifikace JS
    // -------------------------------

    // uglify: {
    //   head: {
    //       src: 'dist/js/script-head.js',
    //       dest: 'dist/js/script-head.min.js'
    //   },
    //   foot: {
    //       src: 'dist/js/script.js',
    //       dest: 'dist/js/script.min.js'
    //   },
    //   load_css: {
    //       src: 'bower_components/loadcss/loadCSS.js',
    //       dest: 'dist/js/lib/load-css.min.js'
    //   }
    // },

    // 3) Obrazky
    // ==========

    // Imagemin: zmensovani datoveho objemu obrazku
    // --------------------------------------------

    imagemin: {
      // Bitmapy v designu
      bitmap: {
        files: [{
          expand: true,
          cwd: 'src/img/bitmap/',
          src: ['**/*.jpg','**/*.png','**/*.gif'],
          dest: 'dist/img/bitmap/'
        }]
      },
      // Obrazky v obsahu
      content_img: {
        files: [{
          expand: true,
          cwd: 'src/img/content/',
          src: ['**/*.jpg','**/*.png','**/*.gif'],
          dest: 'dist/img/content/'
        }]
      },
      // Vektory
      vector: {
        files: [{
          expand: true,
          cwd: 'src/img/vector/',
          src: ['**/*.svg'],
          dest: 'dist/img/vector/'
        }]
      },
    },

    // SVG2PNG
    // -------
    // Z SVG obrazku dela PNG kopie pro fallbacky.

    svg2png: {
      images: {
        files: [
            { cwd: 'dist/img/vector/', src: ['**/*.svg'] }
        ]
      }
    },

    // 4) browserSync, ftp-deploy a watch
    // ==================================

    // browserSync
    // -----------

    // Spusti server na http://localhost:3000/, externe pak na
    // adrese, kterou zobrazi pri startu.
    // Injectuje zmeny v bsFiles bez nutnosti reloadu.
    // Synchronizuje zobrazeni napric zarizenimi.

    browserSync: {
      dev: {
          bsFiles: {
              src : [
                'dist/css/*.css'
              ]
          },
          options: {
              watchTask: true,
              proxy: 'sites.localhost'
          }
      }
    },

    // watch
    // -----

    // Sleduje zmeny v LESS a JS souborech a spousti souvisejici tasky.

    watch: {
      less: {
        files: 'src/less/**/*.less',
        tasks: ['css']
      },
/*TODO      js: {
        files: 'src/js/*.js',
        tasks: ['js']
      }*/
    },

  });


  // 5) Alias tasky
  // =============

  grunt.registerTask('svg', ['imagemin:content_img', 'svg2png']);
  grunt.registerTask('css', ['less:default', 'autoprefixer']);
  grunt.registerTask('img', ['imagemin', 'svg2png']); // TODOBACK
  grunt.registerTask('js', ['concat', 'uglify']);
  grunt.registerTask('default', ['css', /*'js',*/ 'browserSync', 'watch']);

};
