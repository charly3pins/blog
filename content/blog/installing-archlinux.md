https://wiki.archlinux.org/title/USB_flash_installation_medium

First, you need to identify the USB devic

list disks

```vim
diskutil list
```

Your USB device will appear as something like /dev/disk2 (external, physical).

```vim
diskutil unmountDisk /dev/diskX
```

Now copy the ISO image file to the device:

```vim
# dd if=path/to/archlinux-version-x86_64.iso of=/dev/rdiskX bs=1m
```

This command will run silently. To view progress, send SIGINFO by pressing Ctrl+t
if: Especifica la imagen ISO.

of: Especifica el dispositivo USB.

bs=1m: Define el tamaño del bloque (1 MB).

The r before disk is for raw mode which makes the transfer much faster.

Start your laptop , my case thinkpad, and press F12
Select distro
Wait installation

Use the archinstall script

```vim
archinstall
```

(if it's complaining about network, you need to connect it manually using iwctl https://wiki.archlinux.org/title/Iwd)
locale - ES
layout keyword - ES
Mirrors - Spain
Filesystem

- btrfs: copy file new space in memory, update content, update pointers -> rollback
- ext4: update data in the file, overwriting data file -> no rollback
  yes , use comprission

bootloader: grub
hostname: xxx
root pass: **_
user: xxx
pass: _**
superuser: yes
audio: pipewire (new one)
kernel: linux
network: use networkmanager
timezone: Europe/Madrid
save
install

would you like to chroot into the newly created installation and perform post-installation configuration? -> yes

- install display manager -> what users sees when log into
- install desktop environment -> the GUI for the user sessions that just started after login the desktop environment
  |-> GNOME

```vim
pacman -S gnome
```

- all packages
- 1 for emojis

we are in gnome now!

time to restart the laptop

```vim
exit
```

and shut down with our user

```vim
shutdown -h now
```

select arch linux

Gnome display manager didn't load
That's because we did not enable it in system service

```vim
sudo systemctl enable gdm.service
```

enter your password, and that's enabled

time to start the service manually

```vim
sudo systemctl start gdm.service
```

and the gnome display manager will appear

make the tour or skip it, and then click the option key and install neofetch typing

```vim
sudo pacman -S neofetch
```

installing a tiling window manager

```vim
sudo pacman -S i3
```

also install xorg, the implementation of the x window system, a protocol for window management:

```vim
sudo pacman -S xorg
```

in order to use i3, we need to log out our current session, and go back to the gnome device manager
there you need to click your username and on the bottom right it will appear a gear icon, where you can select `i3`
type your password, and you are inside i3!
select your mod key, I used the windows one, but you can choose alt as well.

with mod+enter it should open a terminal but it doesn't,...
we need to config a terminal that i3 recognizes
to exit i3 there is the shorcut shift+mod+e (shift+windows+e on my case)

now we can go to gnome and install there a compatible terminal, so log in in gnome (select it in the bottom gear) and install it
in my case I install alacritty

```vim
sudo pacman -S alacritty
```

logout and log in in i3 again and see if you can see the terminal now with "mod+enter"

with "mod+d" you can open the dmenu, and type the name of the app you want to open
for that you need to install it

```vim
sudo pacman -S dmenu
```

mod+left mod+right to move between panes
mod+number it opens up the workspace number
mod+w tab screen on full screen with each app
mod+e toggles the orientation between horizontal and vertical of your panes
mod+a selects the parent, so if you open a new app and then mod+e, it will put that new below the previous 2 in vertical, and the new one horizontal
shift+mod+space toggles between floating and fullscreen (pane screen) for the app selected

```vim
sudo pacman -S neovim
```

tweaking the i3 config

```vim
neovim ~/.config/i3/config
```

change font-size to 14
mod+shift+r to reload the config

every package not present in pacman, is in AUR
AUR helper -> yay vs paru
installing yay
https://github.com/Jguer/yay

```vim
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

with yay i can install my browser Brave

```vim
yay -S brave
```

installing fonts

```vim
yay -S ttf-meslo-nerd
```

once installed update it in the i3 config, in my case
font-family = MesloLGS Nerd Font Mono

reload the config with mod+shift+r and you will see the new fonts

before continuing manually configuring, i want to use my dotfiles in https://github.com/charly3pins/dotfiles
for that i am going to use stow, a symlink farm manager https://www.gnu.org/software/stow/manual/stow.html

```vim
yay -S stow
```

i also need npm to install some plugins in vim so

```vim
sudo pacman -S npm
```

then i clone my dotfiles in the home

```vim
git clone https://github.com/charly3pins/dotfiles
```


in the dotfiles directory i type "stow nvim" for example and automatically it creates the symlinks and all the config needed for nvim. same for other programs

before i stow my .zshrc i need to install few dependencies that i have otherwise it will fail.
i am using `eza` as a better `ls`

```vim
yay -S eza
```

also i am using a smarter cd command for your terminal called `zoxide`

```vim
yay -S zoxide
```

with these 2 my zsh is ready to shine so I do it after that, other programs can be done in any order


review network manager
sudo pacman -S networkmanager
systemctl enable NetworkManager
systemctl start NetworkManager
nmcli device wifi list
nmlci --ask device wifi connect [B]SSID

and then enter the password

install lazygit
sudo pacman -S lazygit

insall spotify
sudo pacman -S spotify-launcher

installing clipboard provider
sudo pacman -S xclip

external monitor support
xrandr command to verify if HDMI, etc are OK
then installing
sudo pacman -S autorandr
deactivate the laptop screen
xrandr --output eDP-1 --off
store profile
autorandr --save docked
same for the undocked but disabling the HDMI-X that is the external screen
and store it as profile undocked (only laptop)

Ya deberías tener:

Perfil docked: solo HDMI-1 activo, eDP-1 apagado.

Perfil undocked: solo eDP-1 activo, HDMI-1 apagado.

Con el servicio activo:
systemctl --user enable autorandr.service
systemctl --user start autorandr.service

si falla, necesitas crear el systemd file

Crea el archivo de servicio
mkdir -p ~/.config/systemd/user
Luego edita el archivo (puedes usar nano, vim, etc.):

nvim ~/.config/systemd/user/autorandr.service
y añades el siguiente texto:

[Unit]
Description=Autorandr execution service
After=graphical.target

[Service]
Type=oneshot
ExecStart=/usr/bin/autorandr --change
RemainAfterExit=true

[Install]
WantedBy=default.target

Recarga los servicios de usuario
systemctl --user daemon-reexec
systemctl --user daemon-reload

Activa el servicio
systemctl --user enable autorandr.service
systemctl --user start autorandr.service

para cambiar entre perfiles
autorandr --load docked / undocked

instalar spotify terminal
yay -S spotify-player

instalar qutebrowser
yay -S qutebrowser
