#
# ~/.bashrc
#
. $HOME/.bash_aliases 		#source bash_aliases
# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# # If running in tty1, run startx
# if [ "$(tty)" = "/dev/tty1" ]; then startx; fi

shopt -s extglob dotglob globstar

conda-shell () {
    nix-shell ~/.conda-shell.nix
}

ps-shell () {
		nix-shell ~/programs/easy-purescript-nix/ci.nix
}

# # Notes
#stat -- display file permissions -- stat -c %A %n
#lspci -- list PCI bus devices
#ping 8.8.8.8
#sftp cameron@10.0.0.2
#xdg-mime  #check / modify file-type associations
#wpa_passphrase Frontier4704 21422325889218 > /etc/wpa_supplicant.conf #5148275597
#ip a -- get status of wireless devices
#alias ni='nix-instantiate --eval'
#xinput list

# Nix & NixOS
alias ns='nix-shell'
alias cr='less ~/.nixenv | grep'   # check nixpkgs repo file
alias crd='nix-env -qaP --description | grep'   # check nixpkgs repo
alias rb='sudo nixos-rebuild switch'  # rebuild NixOS
alias clean='nix-collect-garbage -d'
alias chupd='nix-channel --update'
alias upgr='nix-env -u'
alias lstbin='ls ~/.nix-profile/bin'
# alias upgv='nix-env --upgrade --always'
alias rollback='nix-env --rollback'
alias inst='nix-env -iA'
alias lgen='nix-env --list-generations'
alias sgen='nix-env --switch-generation'
alias deletegen='nix-env --delete-generations'
alias cleanupdups='nix-store --optimize'
alias unin='nix-env --uninstall'
alias lhave='nix-env -q'
alias linst='nix-env -q --installed'
deriver () {
    nix-store -qd $(which $1)
}
rtdeps () {
    nix-store -qR $(which $1)
}
btdeps () {
    nix-store -qR $(nix-store -qd $(which $1))
}
btdeps-tree () {
    nix-store -q --tree $(nix-store -qd $(which $1))
}
btenv () {
    nix-store --print-env $(nix-instantiate '<nixpkgs>' -A $1)
}
depsgraph () {
    nix-store -q --graph $(which $1) | dot -Tsvg > deps.svg
}
pkg-info-full () {
    nix-env --meta --json -qaA "nixpkgs.$1"
}
nix-what-attr () {
    nix-env -qa $1 --json | jq keys
}
pkg-info () {
    # nix-env -qaA "nixpkgs.$1" --description
    nix-env -qaA "nixpkgs.$1" --json \
        | jq -r '.[] | .name + " " + .meta.description,
           "",
           (.meta.longDescription | rtrimstr("\n"))'
}
# alias anp='nix-env -f '<nixpkgs>' -iA'   # nodePackages.searchterm
cdir () {
    mkdir "$1" && cd "$1"
}
mdcd () {
    mkdir "$1" && cd "$1"
}
findd () {
    find "$1" -name "$2" 2>/dev/null
}
mdcp () {
    mkdir "$1" && cp "$2" "$1"
}
mdmv () {
    mkdir "$1" && mv "$2" "$1"
}
mvmd () {
    mkdir "$2" && mv "$1" "$2"
}

# program aliases
alias wpastart='sudo wpa_supplicant -Bi wlp1s0 -c /etc/wpa_supplicant/wpa_supplicant.conf '
alias al='alias'
alias h='history'
alias dl='echo !' # use as 'dl !<prefix string>', i.e., still insert '!'
alias show='echo'
alias lsg='ls | grep'
alias lg='ls | grep'
alias lstin='dnf list --installed'
alias lstfonts='kitty list-fonts'
alias lf='kitty list-fonts'
alias wh='which'
alias ty='type'
alias osver='hostnamectl' # OS version (and hardware) info
alias bt='blueman-manager'
alias rpmx='rpm2cpio myrpmfile.rpm | cpio -idmv' #rpm extract
alias s='sway'
alias 7zip='7za'
alias ls='ls --color=never -hF'
alias e='exit'
alias c='clear'
alias s='spago'
alias jlang='$prog/j903/jconsole.sh'
alias jl='$prog/j903/jconsole.sh'
alias ulp='nix-env -q --installed > $HOME/.nix-local-installed-progs' # update-local-packages
alias vlch='vlc --longhelp --advanced | less'
alias wttr='curl wttr.in/?format="%c+%f+%p+%s\n"'
alias wttra='curl wttr.in/?format=v2'
alias u='cd ..'
alias src='source $HOME/.bashrc'  # refresh
alias sqlite='sqlite3'
# alias rm='command mv -t /home/cameron/.trash'
alias rmu='command rm' # remove unsafe
alias rmdir='command rm -r' # remove recursive
alias charmap='gucharmap'
alias grep='egrep'
alias mv='mv -i'
alias cp='cp -i'
alias sudo='sudo '
alias kill='kill -9'
alias mp='mplayer -loop 0 -softvol -volume 60'
alias rain1='killall mplayer; mplayer -loop 0 -softvol -volume 20 ~/Music/sleeprain.ogg'
alias rain2='killall mplayer; mplayer -loop 0 -softvol -volume 30 ~/Music/sleeprain.ogg'
alias rain3='killall mplayer; mplayer -loop 0 -softvol -volume 40 ~/Music/sleeprain.ogg'
alias egg="mplayer -loop 0 -softvol -volume 40 ~/Music/Level\ 1\ -\ Eggs\ of\ Steel_\ Charlie\'s\ Eggcellent\ Adventure.mp3"
alias ht="mplayer -loop 0 -softvol -volume 40 ~/Music/Helltaker/Mittsies\ -\ Titanium.mp3"
alias xflux='xflux -z 75044'
alias apl='cd $prog/dzaima-APL/ && ./REPL'
alias dya='dyalog'
# alias rsl='redshift -l 32.96:-96.67 -t 6500:2000'


# wifi -- generic
alias pingg='ping 8.8.8.8'
alias rd='systemctl restart dhcpcd'
alias scan='sudo iw wlp1s0 scan | grep SSID'
alias scanb='iw wlp1s0 scan | grep BSS'
alias logiv='dmesg wlp1s0'
alias checki='ip a | grep "inet '
alias ipsu='sudo ip link set wlp1s0 up'
alias aip='sudo ip addr add 10.0.0.1/8 dev enp0s31f6'

# wifi -- wpa_supplicant
alias wpaon='sudo wpa_supplicant -Bi wlp1s0 -c /etc/wpa_supplicant/wpa_supplicant.conf'
#alias wpaoff='systemctl stop wpa_supplicant'
#alias wpaon='systemctl restart wpa_supplicant'
alias wpastatus='systemctl status wpa_supplicant'
alias wpabg='sudo wpa_supplicant -i wlp1s0 -c f -B'  # (-d for debugging, -B for background/daemon)
conn () {
	  iw wlp1s0 connect -w $1
}
conn-check () {
	  ip a | grep "inet "
}
conn-save () {
	  ip a | grep "inet "
}
rl () {
	  readlink $1
}

# alias wpastart='sudo systemctl start wpa_supplicant' # I think this doesn't work -- wpa is controlled by systemd

# wifi -- network manager
# alias conh='sudo nmcli device wifi connect Frontier4704 password 21422325889218' #5148275597
# alias con='nmcli device wifi connect'
# alias wifi='nmcli device wifi' # list wifi networks


# Misc

# alias ydl='nohup youtube-dl -x --no-playlist -o "~/Music/youtube-dl/%(title)s.%(ext)s" --audio-format mp3 &>/dev/null &'
# alias ydlp='nohup "youtube-dl -cix --yes-playlist -o "~/Music/youtube-dl/%(playlist)s/%(title)s.%(ext)s" --audio-format mp3" &>/dev/null &'
# alias ydlv='nohup "youtube-dl --no-playlist -o "~/Videos/youtube-dl/%(title)s.%(4]+bestaudio[ext=m4a]/best[ext=mp4]/best"" &>/dev/null &'
# alias ydlpv='nohup "youtube-dl -ci --yes-playlist -o "~/Videos/youtube-dl/%(title)s.%(4]+bestaudio[ext=m4a]/best[ext=mp4]/best"" &>/dev/null &'

alias rs='systemctl --user enable --now wireplumber && systemctl --user restart pipewire' #restart sound
alias p='pamix'
alias ydl='youtube-dl -x --no-playlist -o "~/Music/youtube-dl/%(title)s.%(ext)s" --audio-format mp3'
alias ydlp='youtube-dl -cix --yes-playlist -o "~/Music/youtube-dl/%(playlist)s/%(title)s.%(ext)s" --audio-format mp3'
alias ydlv='youtube-dl --no-playlist -o "~/Videos/youtube-dl/%(title)s.%(4]+bestaudio[ext=m4a]/best[ext=mp4]/best"'
alias ydlpv='youtube-dl -ci --yes-playlist -o "~/Videos/youtube-dl/%(playlist)s/%(title)s.%(4]+bestaudio[ext=m4a]/best[ext=mp4]/best"'

# alias emacs-def='git stash push -m "push cac .spacemacs" && mkdir /home/cameron/tmp && mv /home/cameron/.spacemacs /home/cameron/tmp/ && mv -f /home/cameron/spacemacs-default /home/cameron/.spacemacs && emacs -mm'    # "emacs default"
# alias emacs-cac='git stash pop'
# # alias emacs-cac='mv -f home/cameron/tmp/.spacemacs  /home/cameron/ && mv -f /home/cameron/spacemacs-default /home/cameron/.spacemacs && emacs -mm'

alias uni='command cp /etc/nixos/configuration.nix  /home/cameron/.configuration.nix'
alias uvi='mv -f ~/Downloads/vimium-options.json  ~/.vimium-options.json'
alias uvc='mv -f ~/Downloads/vimium_c*.json  ~/.vimium_c.json'
alias wname='echo -e "NAME = Title, CLASS = (Instance, Class):\n" && xprop | grep "WM_CLASS|^WM_NAME|WM_WINDOW_ROLE"' # get [instance, class, title] of whatever window we click on next
alias xmu='xmodmap ~/.Xmodmap'  # update xmodmap
alias updatekeys='xmodmap ~/.Xmodmap'  # update xmodmap
alias xmf='xmodmap ~/.Xmodmap-fallback'  # fall back to safe mapping
alias safekeys='xmodmap ~/.Xmodmap-fallback'  # fall back to safe mapping
alias defaultkeys='xmodmap ~/.Xmodmap-fallback'  # fall back to safe mapping
alias xme='xmodmap -pke > ~/.Xmodmap-fallback-tmp'  # export current keymap to holding file
alias xmexportpermanent='xmodmap -pke > ~/.Xmodmap-fallback'  # export current keymap to holding file
alias key='xev'
alias wifioff='sudo rfkill block all'
alias wd='sudo rfkill block all'
alias wifion='sudo rfkill unblock all'
alias we='sudo rfkill unblock all'
alias size='du -sh'
alias lmon='xrandr --current' # list monitors
alias findp='find . -ipath'
alias cmd='command' # "raw"
alias pgctl='pg_ctl'
alias ir='i3-msg reload'
alias vimode='set -o vi'
alias tr='racket -I typed/racket'
alias ra='racket'
alias fonts='gucharmap'
alias lfonts='gtk2fontsel'
alias lst='ps -A | grep'
alias xr='xrdb -merge ~/.Xdefaults'
alias bat='acpi'    # or 'upower ...'
# alias music='cmuse'
# alias zip='7z a' # zip <NAME>.7z <SOURCE>   # yes, the ".7z" is needed, even though it's semantically redundant
# alias unzip='7z x'
alias zip='tar czf'
alias unzip='tar xf'
alias wpa='wpa_supplicant'
alias sys='systemctl'
alias status='systemctl status'
alias restart='systemctl restart'
alias start='systemctl start'
alias stop='systemctl stop'
alias bhi='sudo brightnessctl set 100%'
alias bmhi='sudo brightnessctl set 75%'
alias bmed='sudo brightnessctl set 50%'
alias bmlo='sudo brightnessctl set 25%'
alias blo='sudo brightnessctl set 15%'
alias bsp='sudo brightnessctl set +10%'
alias bsm='sudo brightnessctl set 10%-'
alias br3='sudo brightnessctl set 3%'
alias br2='sudo brightnessctl set 2%'
alias br1='sudo brightnessctl set 1%'
alias pade="xinput set-prop "$(xinput list | grep -i touchpad | cut -f 2 | grep -oE '[[:digit:]]+')" 'Device Enabled' 1"
alias sticke="xinput set-prop "$(xinput list | grep -i stick | cut -f 2 | grep -oE '[[:digit:]]+')" 'Device Enabled' 1"
alias alsamutetoggle='amixer -q -D pulse sset Master toggle'

#alias mvfiles='find . type f -regextype egrep -regex '.*[a-z]+\.el$' -execdir mv -t dest {} \+'  # example only

# config edits
alias enc='emacs -nw /etc/nixos/configuration.nix -fs'
alias eba='emacs -nw ~/.bashrc -fs'
alias evi='emacs -nw ~/.vimrc -fs'
alias eiwm='emacs -nw ~/.i3/config -fs'
alias eis='emacs -nw ~/.i3status.conf -fs'
alias ete='emacs -nw ~/.config/termite/config -fs'
alias eki='emacs -nw ~/.config/kitty/kitty.conf -fs'
alias etm='emacs -nw ~/.tmux.conf -fs'
alias est='emacs -nw ~/.config/stretchly/config.json -fs'
# alias es='emacs -nw ~/.config/sway/config -fs'

# git commands
alias unstage='git restore' # "unstage"
alias untrack='git rm --cached' # "untrack"
alias switch='git switch'
alias st='git status'
alias commit='git commit'
alias grm='git rm'
alias restore='git restore'
alias branch='git branch'
alias cbr='git switch -c'
alias cbrO='echo "use cbr [-f | --force]"'
alias cbrF='echo "use cbr [-f | --force]"'
alias pull='git pull'
alias pullr='git pull --rebase'
alias push='git push'
alias add='git add'
alias amend='git commit amend'
alias reba='git rebase'
alias rebase='git rebase'
alias reset='git reset'
alias log='git log'
alias logp='git log --pretty=oneline'
alias logpp='git log --all --decorate --oneline --graph'
alias ltracked='git ls-tree -r --name-only' #list tracked files in given branch
alias ltr='git ls-tree -r --name-only' #list tracked files in given branch
alias tag="git tag"


export wifi="wlp1s0"
export N="/dev/null"
export PATH="$PATH:$HOME/.rbenv/bin"
export PATH="$PATH:$HOME:$HOME/.local/bin:$HOME/.config/yarn/global/node_modules/.bin:$HOME/programs/search-nixpkgs"
export PATH="${PATH}:/usr/lib/jvm/java-6-open-jdk/bin"
export AVOUTPUT="$HOME/AVOutput"
export XDG_CONFIG_HOME="$HOME/.config"
export TERM="kitty" #termite
export BROWSER="google-chrome-stable"
export EDITOR="vim"
export GIT_EDITOR="vim"
export VISUAL="vim"
export conf="$HOME/.config/"
export h="$HOME"
export doc="$HOME/Documents"
export docs="$HOME/Documents"
export dl="$HOME/Downloads"
export dls="$HOME/Downloads"
export font="/usr/share/fonts"
export fonts="/usr/share/fonts"
export mus="$HOME/Music"
export pic="$HOME/Pictures"
export pics="$HOME/Pictures"
export prog="$HOME/programs"
export progs="$HOME/programs"
export proj="$HOME/projects"
export projs="$HOME/projects"
export vid="$HOME/Videos"
export vids="$HOME/Videos"

# export NIXPKGS_ALLOW_UNFREE=1

PS1='[\u@\h \W]\$ '

stty -ixon

eval "$(rbenv init - bash)"
eval "$(rbenv init -)"
