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
