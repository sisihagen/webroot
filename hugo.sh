#!/bin/bash

case "$1" in
    help)
          echo "build     > Running all gulp production tasks"
          echo "git       > add, commit and push to git repo"
          echo "hugobuild > only build page with hugo"
          echo "opts      > Running sass-convert to clean scss files"
          echo "optj      > Runing js-beautify to clean gulp files"
          echo "watch     > start default task of gulp"
          echo "default   > running the hugo Development Server"
    ;;

    build)
        ./node_modules/.bin/gulp build
    ;;

    hugobuild)
        ./node_modules/.bin/gulp hugo
    ;;

    opts)
        find $PWD/static/static/scss -type f -name "*.scss" -exec sass-convert --from scss --to scss --in-place --indent 4 {} \;
    ;;

    optj)
        for i in $(ls gulp-task/*.js) ; do js-beautify $i -o $i ; done
    ;;

    git)
      ./node_modules/.bin/gulp release
    ;;

    watch)
      ./node_modules/.bin/gulp
    ;;

    *)
        hugo server -D --i18n-warnings --watch --ignoreCache --verbose --disableFastRender --bind 192.168.178.24 --baseURL http://192.168.178.24
    ;;
esac
