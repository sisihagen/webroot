#!/usr/bin/env bash

case "$1" in
    help)
          echo "build     > Running all gulp production tasks"
          echo "hugobuild > only build page with hugo"
          echo "git       > git Management"
          echo "bump      > bump version in package.json"
          echo "default   > running the hugo Development Server"
    ;;

    build)
        ./bin/build.sh
    ;;

    hugobuild)
        hugo
    ;;

    git)
      git add .
      git commit -m "$2"
      git push ; git push gl
    ;;

    bump)
      npm version patch
    ;;

    *)
        hugo server -D --i18n-warnings --watch --ignoreCache --verbose --disableFastRender
    ;;
esac
