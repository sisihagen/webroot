---
title: "Sublime Translate Shell"
date: 2018-06-07T09:38:47+02:00
tags: "Computer"
draft: false
shorttext: "Utilisez le texte sublime et le shell Translate pour faciliter la traduction."
keywords: "Sublime Text, Translation, Translate Shell, Bash, Linux, Python, ST"
cover: "computer"
lang: fr
---

J'utilise comme éditeur de texte [sublime texte](http://sublimetext.com "ST éditeur de texte"), Slim, rapide et avec de nombreuses possibilités grâce à des plugins et des modifications propres.

Il ya certainement différents plugins pour les traductions à St, mais ceux-ci sont trop rigides parce qu'ils sont liés à un moteur seulement. Il est donc très proche de l'utilisation de l'outil [Translate-Shell](https://github.com/soimort/translate-Shell "translate-Shell sur GitHub").  

Pour que TS fonctionne quelques préparations sont nécessaires, je préférerais qu'il fonctionne à la volée comme dans vim ou Emacs, mais à la fin il est suffisant avec le texte marqué. Pour ce faire, nous avons d'abord créer notre propre plugin.

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

Ensuite, nous créons une tâche de construction de travailler avec notre plugin. 

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

Maintenant, écrivez du texte, marquez le texte et exécutez la tâche de génération. La sortie que vous trouvez dans la fenêtre Shell. 

![Sublime Text with our Plugin](/static/img/content/2018/1.gif "Sublime Text with our Plugin")
