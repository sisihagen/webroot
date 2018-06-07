---
title: "Sublime and Translate Shell"
date: 2018-06-07T09:10:42+02:00
tags: "Computer"
draft: false
shorttext: "Sublime Text und die translate-shell zur Übersetzung gemeinsam nutzen."
keywords: "Sublime Text, Übersetzung, Translate Shell, Bash, Linux, Python"
cover: "computer"
lang: de
---

Ich nutze als Text Editor [Sublime Text](http://sublimetext.com "Sublime Text Editor"), schlank, schnell und mit vielen Möglichkeiten durch Plugins und eigene Modifizierungen. 

Es gibt sicher verschiedene Plugins für Übersetzungen in ST, aber diese sind zu unflexibel da ausschließlich an eine Engine gebunden. Es liegt also nahe das Multitool [translate-shell](https://github.com/soimort/translate-shell "Translate-Shell on Github") zu benutzen. 

Damit TS funktioniert sind ein paar Vorbereitungen nötig, mir wäre zwar lieber es würde onfly wie bei vim, oder emacs funktionieren, aber es ist ausreichend markierten Text zu übersetzen. 

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

Als nächsten müssen wir einen Build Task erstellen um auf das Plugin zu zu greifen.

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

Danach können wir Text schreiben, Text markieren und in der Shell erhalten wir die entsprechende Übersetzung. 

![Sublime Text with our Plugin](/static/img/content/2018/1.gif "Sublime Text with our Plugin")
