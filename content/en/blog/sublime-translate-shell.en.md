---
title: "Sublime and Translate"
date: 2018-06-07T09:10:42+02:00
tags: "Computer"
draft: false
shorttext: "Use sublime text and the translate shell for easy translation."
keywords: "Sublime Text, Translation, Translate Shell, Bash, Linux, Python, ST"
cover: "computer"
lang: en
---

I use as text editor [sublime text](http://sublimetext.com "Sublime text editor"), slim, fast and with many possibilities through plugins and own modifications.

There are certainly different plugins for translations in ST, but these are too inflexible because they are bound to an engine only. So it's very close to using the Multitool [translate-Shell](https://github.com/soimort/translate-shell "Translate-shell on GitHub ").  

In order for TS to work a few preparations are necessary, I would prefer it would work on fly like in vim or emacs, but in the end it is enough with the marked text. To do this, we first create our own plugin. 

Tools > Developer > New Plugin ...

~~~ python
import sublime
import sublime_plugin

from Default.exec import ExecCommand


class ExecSelectionCommand(ExecCommand):
    def run(self, **kwargs):
        # Extract from our arguments the potential replacement build options
        # that can contain the new $SELECTION variable.
        cmd_sel = kwargs.pop("cmd_sel", None)
        shell_cmd_sel = kwargs.pop("shell_cmd_sel", None)

        # Obtain the selection from the currently active view, which may be an
        # empty string.
        v = self.window.active_view()
        selection = "" if v is None else "\n".join([v.substr(s) for s in v.sel()])

        # Obtain the standard variables, then add in the selection if we found
        # one. If the selection is empty, it's not added to the list of
        # variables so that a default can be used.
        cVars = self.window.extract_variables()
        if selection:
            cVars["SELECTION"] = selection

        # If the build has an alternate "cmd" argument, expand it.
        if cmd_sel is not None:
            kwargs["cmd"] = sublime.expand_variables(cmd_sel, cVars)

        # If the build has an alternate "shell_cmd" argument, expand it.
        if shell_cmd_sel is not None:
            kwargs["shell_cmd"] = sublime.expand_variables(shell_cmd_sel, cVars)

        # Let our parent class (the standard exec command) perform the build
        # now.
        super().run(**kwargs)
~~~

Next we create a build task to work with our plugin.

Tools > Build System > New Build System ...

~~~ json
{
    // Specify our own command to execute the build, providing the correct
    // arguments to pass to it to cancel a running build.
    "target": "exec_selection",
    "cancel": {"kill": true},

    "cmd_sel": ["trans", "-no-ansi", ":fr", "${SELECTION:No Selection}"]
}
~~~

Now write text, mark the text and run the build task. The output you find in the shell window. 

![Sublime Text with our Plugin](/static/img/content/2018/1.gif "Sublime Text with our Plugin")
