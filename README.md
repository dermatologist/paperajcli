paperajcli
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/paperajcli.svg)](https://npmjs.org/package/paperajcli)
[![Downloads/week](https://img.shields.io/npm/dw/paperajcli.svg)](https://npmjs.org/package/paperajcli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g paperajcli
$ paperajcli COMMAND
running command...
$ paperajcli (--version)
paperajcli/0.0.0 darwin-arm64 node-v24.11.1
$ paperajcli --help [COMMAND]
USAGE
  $ paperajcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`paperajcli hello PERSON`](#paperajcli-hello-person)
* [`paperajcli hello world`](#paperajcli-hello-world)
* [`paperajcli help [COMMAND]`](#paperajcli-help-command)
* [`paperajcli plugins`](#paperajcli-plugins)
* [`paperajcli plugins add PLUGIN`](#paperajcli-plugins-add-plugin)
* [`paperajcli plugins:inspect PLUGIN...`](#paperajcli-pluginsinspect-plugin)
* [`paperajcli plugins install PLUGIN`](#paperajcli-plugins-install-plugin)
* [`paperajcli plugins link PATH`](#paperajcli-plugins-link-path)
* [`paperajcli plugins remove [PLUGIN]`](#paperajcli-plugins-remove-plugin)
* [`paperajcli plugins reset`](#paperajcli-plugins-reset)
* [`paperajcli plugins uninstall [PLUGIN]`](#paperajcli-plugins-uninstall-plugin)
* [`paperajcli plugins unlink [PLUGIN]`](#paperajcli-plugins-unlink-plugin)
* [`paperajcli plugins update`](#paperajcli-plugins-update)

## `paperajcli hello PERSON`

Say hello

```
USAGE
  $ paperajcli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ paperajcli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/repos/paperajcli/blob/v0.0.0/src/commands/hello/index.ts)_

## `paperajcli hello world`

Say hello world

```
USAGE
  $ paperajcli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ paperajcli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/repos/paperajcli/blob/v0.0.0/src/commands/hello/world.ts)_

## `paperajcli help [COMMAND]`

Display help for paperajcli.

```
USAGE
  $ paperajcli help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for paperajcli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.36/src/commands/help.ts)_

## `paperajcli plugins`

List installed plugins.

```
USAGE
  $ paperajcli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ paperajcli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/index.ts)_

## `paperajcli plugins add PLUGIN`

Installs a plugin into paperajcli.

```
USAGE
  $ paperajcli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into paperajcli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PAPERAJCLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PAPERAJCLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ paperajcli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ paperajcli plugins add myplugin

  Install a plugin from a github url.

    $ paperajcli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ paperajcli plugins add someuser/someplugin
```

## `paperajcli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ paperajcli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ paperajcli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/inspect.ts)_

## `paperajcli plugins install PLUGIN`

Installs a plugin into paperajcli.

```
USAGE
  $ paperajcli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into paperajcli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PAPERAJCLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PAPERAJCLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ paperajcli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ paperajcli plugins install myplugin

  Install a plugin from a github url.

    $ paperajcli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ paperajcli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/install.ts)_

## `paperajcli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ paperajcli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ paperajcli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/link.ts)_

## `paperajcli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ paperajcli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperajcli plugins unlink
  $ paperajcli plugins remove

EXAMPLES
  $ paperajcli plugins remove myplugin
```

## `paperajcli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ paperajcli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/reset.ts)_

## `paperajcli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ paperajcli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperajcli plugins unlink
  $ paperajcli plugins remove

EXAMPLES
  $ paperajcli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/uninstall.ts)_

## `paperajcli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ paperajcli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ paperajcli plugins unlink
  $ paperajcli plugins remove

EXAMPLES
  $ paperajcli plugins unlink myplugin
```

## `paperajcli plugins update`

Update installed plugins.

```
USAGE
  $ paperajcli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/update.ts)_
<!-- commandsstop -->
