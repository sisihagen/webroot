# silviosiefke.com / silviosiefke.de / silviosiefke.fr

Here you can see how I create my private website. I use the static site generator [Hugo](https://gohugo.io "The world’s fastest framework for building websites").

I use the following frameworks.

* [Hocus Pocus](https://github.com/bkzl/hocus-pocus "Universal and lightweight stylesheet starter kit") as CSS Framework
* [Normalize.css](https://github.com/necolas/normalize.css "A modern, HTML5-ready alternative to CSS resets") as CSS Reset
* [Colors](http://clrs.cc "A nicer color palette for the web.") as color Framework
* [Jquery](http://jquery.com) as Javascript library for the Menu and the cover images
* [Gulp](https://gulpjs.com "Automate and enhance your workflow") to build and fixed the site
* [PostCSS](http://postcss.org "A tool for transforming CSS with JavaScript") for dealing with css files
* [Icomoon](https://icomoon.io) for svg Files

For including my Twitter Timeline I use the script [Twitterfeed](https://tomelliott.com/demos/jquery-twitter-feed/js/twitterfeed.js) which is published by [www.tomelliott.com](http://www.tomelliott.com). I use it not in same way, the script use twitter.json instead of the php script. The php script is running per Cron every 6 hours. For using the script you need to register a [Twitter](https://apps.twitter.com) App.

The php script write simple the json file you need for the Java Script File. 

```php
<?php
session_start();
require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library

$twitteruser = "";
$notweets = 30;
$consumerkey = "";
$consumersecret = "";
$accesstoken = "";
$accesstokensecret = "";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

$fp = fopen('../twitter.json', 'w');
fwrite($fp, json_encode($tweets));
fclose($fp);
?>
```


If you want use the page install [Hugo](https://gohugo.io "The world’s fastest framework for building websites"), [Git](https://www.git-scm.com/ "distributed VCS designed for speed and efficiency") and [Nodejs](https://nodejs.org/en/) I use Arch Linux and Gentoo so I not know how to install the stuff on other operating systems. 

```bash
pacman -S hugo git nodejs python-pygments
emerge -av www-apps/hugo net-libs/nodejs dev-vcs/git dev-python/pygments
```

Now the basis is installed we can try to run the projects.

```bash
git clone https://github.com/sisihagen/webroot
cd webroot
npm install ; bower install
./hugo.sh 
```


