# silviosiefke.com / silviosiefke.de / silviosiefke.fr

Here you can see how I create my private website. I use the static site generator [Hugo](https://gohugo.io "The world’s fastest framework for building websites").

I use the following frameworks.

* [Normalize.css](https://github.com/necolas/normalize.css "A modern, HTML5-ready alternative to CSS resets") as CSS Reset
* [Jquery](http://jquery.com) as Javascript library for awesome tricks
* [Yarn](https://yarnpkg.com/) as package Manager for JS Librarys
* [PostCSS](http://postcss.org) for dealing with css files
* [Icomoon](https://icomoon.io) for svg Files
* [Minify](https://github.com/tdewolff/minify) to minify html files


If you want play with the page install [Hugo](https://gohugo.io "The world’s fastest framework for building websites"), [Git](https://www.git-scm.com/ "distributed VCS designed for speed and efficiency"), [yarn](https://yarnpkg.com/lang/en/ "FAST, RELIABLE, AND SECURE DEPENDENCY MANAGEMENT.") and [Nodejs](https://nodejs.org/en/) I use Arch and Gentoo so I not know how to install the stuff on other operating systems. 

```bash
pacman -S hugo git nodejs python-pygments yarn
emerge -av hugo net-libs/nodejs git pygments yarn
```

Now the basis is installed we can try to run the projects.

```bash
git clone https://github.com/sisihagen/webroot
cd webroot
yarn install
./bin/hugo.sh 
```
