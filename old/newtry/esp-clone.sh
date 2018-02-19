#!/bin/bash
# Build the esp 8266 open-sdk and related tools in current directory.
#
# Tested on Ubuntu 16.04.1 and 14.04.4/5.
# It takes up to an hour to build and several GB of space, so be prepared!
# 
# Use it with:
# wget -O esp-clone.sh https://gist.githubusercontent.com/con-f-use/d086ca941c2c80fbde6d8996b8a50761/raw && chmod +x esp-clone.sh && ./esp-clone.sh
#
# ToDo: Ask the user when install installing examples or checking for Ubuntu, make a -y option to proceed automatically

lsb_release -d | grep -q Ubuntu || \
    { >&2 echo -e "Error: You need to be on Ubuntu to use this script.\n\nOn compatible systems, you might want to try commenting this check!"; exit 1; }
aptsl="/etc/apt/sources.list"
unset LD_LIBRARY_PATH C_INCLUDE_PATH LIBRARY_PATH LPATH CFLAGS CXXFLAGS
# On some systems, above line might cause more problems than it solves

# Add sources
test -r "$aptsl" -a -f "$aptsl" && \
	sudo cp -b "$aptsl" "$aptsl.backup$(date +%y%m%d)" # backup
sudo apt-add-repository universe
sudo apt-add-repository multiverse   
#sudo apt-add-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -cs) main restricted"

# Install packages
sudo apt-get update && \
sudo apt-get install -y make unrar autoconf automake libtool gcc g++ gperf flex bison texinfo-doc-nonfree install-info info texinfo gawk ncurses-dev libexpat-dev python-dev python python-serial sed git unzip bash help2man wget bzip2 \
	|| exit 1
sudo apt-get install -y libtool-bin # not needed in some Ubuntu versions

# Build esptool-ck
git clone --recursive https://github.com/igrr/esptool-ck.git || exit 1
cd esptool-ck
make
cd ..

# Build sdk
git clone --recursive https://github.com/pfalcon/esp-open-sdk.git || exit 1   
cd esp-open-sdk
sed -i 's/^\(\s*VENDOR_SDK\s*=\s*\).*$/\1 1.5.2/' Makefile   # Old version of sdk (v1.5.2) before espressif filled the iram
#git checkout e32ff685 # Old version of sdk (v1.5.2) before espressif filled the iram
make STANDALONE=y \
  || { >&2 echo "pfalcon's Makefile seems to have a problem.\nTry executing make with shells of varying cleanness, i.e. 'env -i bash --norc --noprofile -c ...'\n. Also check shell variables for gcc's library and include paths"; exit 1; }
find . -name "c_types.h" -exec cp "{}" "{}.patched" \;
# Line below fixes a bug, when e32ff685 or other old versions are used
#find -type f -name 'c_types.h.orig' -print0 | while read -d $'\0' f; do cp "$f" "${f%.orig}"; done
cd ..

exdir="82XX-projects"
# Download a few software examples
if echo "$1" | grep -qi "examples"; then
    echo "Downloading example projects to '$exdir'..."
    mkdir "$exdir"
    cd "$exdir"
    git clone --recursive https://github.com/con-f-use/esp82XX-basic.git
    git clone --recursive https://github.com/cnlohr/esp8266ws2812i2s.git
    git clone --recursive https://github.com/cnlohr/colorcord.git
    git clone --recursive https://github.com/esp8266/source-code-examples.git
    ln -s colorchord/embedded8266 8266colorcord
    cd ..
fi

echo "Path to the sdk: $(readlink -f $(pwd))/esp-open-sdk"
echo "We're done!"
