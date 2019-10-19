#!/usr/bin/env bash

CURLINE=1
LINES=wc -l de.list | awk '{ print $2 }'

while [[ $CURLINE -le $LINES ]]; do
  CURDATE="sed -n ${CURLINE}p de.list"
  for FILE in en.list fr.list ru.list; do
    COUNT="grep -c -e '${CURDATE}' ${FILE}"
    if [[ $COUNT -eq 0 ]]; then
      echo "${CURDATE} missing in ${FILE}";
    fi
  done
done

