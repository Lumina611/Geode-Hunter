#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
printf '\n晶洞猎人 V0.2\n请在浏览器打开：http://127.0.0.1:8773/prototype/\n保持本窗口开启，玩完按 Control+C 停止。\n\n'
python3 -m http.server 8773 --bind 127.0.0.1
