#!/usr/bin/env bash

case $1 in
    # help to find images without webp part
    # use it with ./bin/helper.sh webp static/static/img/content/2019/*.jpg
    webp )
      for file in $2
      do
        if [[ -e ${file%%jpg}webp ]]; then
          echo "all perfect"
        else
          echo ${file%%jpg}miss
        fi
      done
    ;;
esac
