#!/bin/sh
$(env)
for i in $(env | grep APP_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files

    # sed JS and CSS only
    find /app/frontend/dist -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done
