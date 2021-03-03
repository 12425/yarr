# yarr

**yarr** (yet another rss reader) is a web-based feed aggregator which can be used both
as a desktop application and a self-hosted server.

It is written in Go with the frontend in Vue.js. The storage is backed by SQLite.

![screenshot](etc/promo.png)

## usage

The latest prebuilt binaries for Linux/MacOS/Windows are available
[here](https://github.com/nkanaev/yarr/releases/latest).

### macos

Download `yarr-*-macos64.zip`, unzip it, place `yarr.app` in `/Applications` folder.

The binaries are not signed, because the author doesn't want to buy a certificate.
Apple hates cheapskate developers, therefore the OS will refuse to run the application.
To bypass these measures, you can run the command:

    xattr -d com.apple.quarantine /Applications/yarr.app

### windows

Download `yarr-*-windows32.zip`, unzip it, place wherever you'd like to
(`C:\Program Files` or Recycle Bin). Create a shortcut manually if you'd like to.

Microsoft doesn't like cheapskate developers too,
but might only gently warn you about that, which you can safely ignore.

### linux

The Linux version doesn't come with the desktop environment integration.
For easy access you can manually create a desktop menu entry by
by following the steps below:

    unzip -x yarr*.zip
    sudo mv yarr /usr/local/bin/yarr
    sudo nano /usr/local/share/applications/yarr.desktop

and paste the content:

    [Desktop Entry]
    Name=yarr
    Exec=/usr/local/bin/yarr -open
    Icon=rss
    Type=Application
    Categories=Internet;

## build

Install `Go >= 1.16` and `gcc`. Get the source code:

    git clone --recurse-submodules https://github.com/nkanaev/yarr.git

Then run one of the corresponding commands:

    # create an executable for the host os
    make build_macos    # -> _output/macos/yarr.app
    make build_linux    # -> _output/linux/yarr
    make build_windows  # -> _output/windows/yarr.exe

    # ... or start a dev server locally
    make serve          # starts a server at http://localhost:7070

    # ... or build a docker image
    docker build -t yarr .

## keyboard shortcuts
:warning: These shortcuts are case-sensitive
### general
| key | action                       |
|-----|------------------------------|
| r   | toggle item as read / unread |
| R   | mark all items as read       |
| s   | star / unstar item           |
| ?   | focus the search bar         |
| A   | view All items               |
| U   | view Unread items            |
| S   | view Starred items           |
### navigation (vim-like)
| key | action                   |
|-----|--------------------------|
| j   | go to next feed item     |
| k   | go to previous feed item |
| l   | go to next feed          |
| h   | go to previous feed      |

## credits

[Feather](http://feathericons.com/) for icons.
