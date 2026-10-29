# Bash Coding Standards

## Scope
All bash scripts across the dailp-encoding repository.

## Verification and Compliance
1. Manual review: When writing code and performing code review, 
ensure scripts follow these standards.
Cite standards not followed using their ID.
2. (forthcoming) automated linting with `shellcheck`

## Standards
| ID | Standard |
|----|----------|
| [BASH-001](#bash-001) | Interpreter invocation via `#!/usr/bin/env bash` |
| [BASH-002](#bash-002) | Consistent use of the `function` keyword |
| [BASH-003](#bash-003) | `lower_snake_case` naming for functions and variables |
| [BASH-004](#bash-004) | `local` for every function-scoped variable, including loop variables |
| [BASH-005](#bash-005) | Separate `local` declaration from command-substitution assignment |
| [BASH-006](#bash-006) | `[[ … ]]` preferred over `[ … ]` / `test` |
| [BASH-007](#bash-007) | `(( … ))` for numeric comparisons, not `[[ … ]]` |
| [BASH-008](#bash-008) | Quote all variable expansions |
| [BASH-009](#bash-009) | Brace-delimited expansion, `${var}` |
| [BASH-010](#bash-010) | STDERR for diagnostics/errors, STDOUT reserved for real output |
| [BASH-011](#bash-011) | `$(command)` instead of backticks |
| [BASH-012](#bash-012) | `command -v` instead of `which` |
| [BASH-013](#bash-013) | Check command status directly, not via a later bare `$?` |
| [BASH-014](#bash-014) | Arrays for argument lists, never delimited strings |
| [BASH-015](#bash-015) | A `main` function as the program entry point |
| [BASH-016](#bash-016) | Two-space indentation, no tabs |
| [BASH-017](#bash-017) | Named CLI/function flags listed and parsed in alphabetical order |
| [BASH-018](#bash-018) | Resolve a script's own directory via `${BASH_SOURCE[0]}`, not `$0` |
| [BASH-019](#bash-019) | Exit for misuse, return for checkable/recoverable outcomes |
| [BASH-020](#bash-020) | Full header comment block on every library function |
| [BASH-021](#bash-021) | Validate external input before interpolating it into another language (SQL) |
| [BASH-022](#bash-022) | Nameref target names must not collide with same-named locals in the defining function |
| [BASH-023](#bash-023) | Consistent parameter position for a shared concept across sibling functions |
| [BASH-024](#bash-024) | Nounset (`set -u`) safety: every variable has an explicit default or a guaranteed prior assignment |
| [BASH-025](#bash-025) | Functions accept named `--flag=value` arguments rather than positional parameters |
| [BASH-026](#bash-026) | Positional/unnamed arguments always follow named arguments at a call site |
| [BASH-027](#bash-027) | Exit codes follow a project-wide convention: 0=success, 1=retryable, 2=fatal |

---

### BASH-001

**Standard:**
Every executable script begins with `#!/usr/bin/env bash`.

**Description:**
Using `env` to locate `bash` (rather than hardcoding `#!/bin/bash`) finds
whichever `bash` is first on `PATH`, which prioritizes `bash` from the nix shell.

**Testable assertion:**
The first line of every `.sh` file in this project is exactly
`#!/usr/bin/env bash`.

**Source:**
[Google Shell Style Guide, "Which Shell to Use"](https://google.github.io/styleguide/shellguide.html#s1.1-which-shell-to-use).

---

### BASH-002

**Standard:**
Every function definition uses the `function` keyword:
`function name() { ... }`.

**Description:**
Bash allows function definitions with or without the `function` keyword.
Using the `function` keyword makes function definitions easier to spot when scanning a file.

**Testable assertion:**
Every function definition across all three files matches the pattern
`^function [a-z_]+\(\) \{`; no file contains a function defined as
`name() { ... }` without the `function` keyword.

**Source:**
[Google Shell Style Guide, "Function Names"](https://google.github.io/styleguide/shellguide.html#s7.1-function-names) — *"The `function` keyword is optional, but must be used consistently throughout a project."*

---

### BASH-003

**Standard:**
Function and variable names use lowercase words separated by underscores
(e.g. `check_psql_installed`, `table_count`).

**Description:**
Consistent, readable naming distinguishes ordinary variables/functions
(lowercase) from constants and exported environment variables (uppercase).
Snake case is more idiomatic for shell programming.

**Testable assertion:**
No function or local-variable name in the project contains an uppercase
letter.

**Source:**
[Google Shell Style Guide, "Function Names" / "Variable Names"](https://google.github.io/styleguide/shellguide.html#s7.2-variable-names).

---

### BASH-004

**Standard:**
Every variable assigned inside a function — including `for` loop control
variables — is declared with `local`.

**Description:**
Undeclared variables assigned inside a function leak into the caller's
scope (and, transitively, the global scope) once the function returns.

**Testable assertion:**
For every function in the project, every variable name that appears on the
left-hand side of an assignment or as a `for`/`for ((...))` loop variable
also appears in a `local` declaration within that same function.

**Source:**
[Google Shell Style Guide, "Control Flow"](https://google.github.io/styleguide/shellguide.html#s5.4-control-flow) — *"If inside a function remember to declare the loop variable as a local to avoid it leaking into the global environment."*

---

### BASH-005

**Standard:**
When a `local` variable's value comes from a command substitution, the
declaration and the assignment are separate statements.

**Description:**
`local var="$(cmd)"` on one line discards `cmd`'s exit status — `local`'s
own (successful) status is what `$?` reflects afterward, silently hiding failures.
Splitting into `local var; var="$(cmd)"` preserves `cmd`'s
exit status for inspection.

**Testable assertion:**
No line in the project matches the pattern `local [a-z_]+=\"?\$\(`.

**Source:**
[ShellCheck SC2155](https://www.shellcheck.net/wiki/SC2155) — *"Declare and assign separately to avoid masking return values."*

---

### BASH-006

**Standard:**
Conditionals use `[[ … ]]`, never `[ … ]` or `test`.

**Description:**
`[[ … ]]` is a bash keyword that avoids word-splitting and pathname
expansion on its operands and supports `==`/`!=` pattern matching and `=~`
regex matching, which `[ … ]` does not.

**Testable assertion:**
No conditional expression in the project uses a single bracket `[ ... ]` or
the `test` command.

**Source:**
[Google Shell Style Guide, "Test, `[ … ]`, and `[[ … ]]`"](https://google.github.io/styleguide/shellguide.html#s6.3-tests).

---

### BASH-007

**Standard:**
Numeric/arithmetic comparisons use `(( … ))`, not `[[ … ]]` with
`-lt`/`-gt`/`-eq` or (worse) `<`/`>`.

**Description:**
`<`/`>` inside `[[ … ]]` perform lexicographic string comparison, not
numeric comparison — a common source of bugs. `(( … ))` is unambiguous for
arithmetic. 

**Testable assertion:**
No line in the project matches `\[\[.*-(lt|gt|le|ge|eq|ne) ` or uses `<`/`>`
inside `[[ … ]]` for a numeric comparison.

**Source:**
[Google Shell Style Guide, "Arithmetic"](https://google.github.io/styleguide/shellguide.html#s6.9-arithmetic) — *"For preference, don't use `[[ … ]]` at all for numeric comparisons, use `(( … ))` instead."*

---

### BASH-008

**Standard:**
Variable expansions, command substitutions, and anything containing spaces
or shell metacharacters are quoted, unless intentional
word-splitting/globbing is required.

**Description:**
Unquoted expansions are subject to word-splitting and pathname expansion,
which is rarely what's intended and is a frequent source of subtle bugs
(e.g. arguments silently disappearing or multiplying).

**Testable assertion:**
Every `$variable` or `$(command)` expansion in the project is enclosed in
double quotes, except where a comment explicitly documents why unquoted
expansion is required.

**Source:**
[Google Shell Style Guide, "Quoting"](https://google.github.io/styleguide/shellguide.html#s5.7-quoting).

---

### BASH-009

**Standard:**
Multi-character variable names are expanded using the brace-delimited
form, `${var}`, rather than `$var`.

**Description:**
Bracing makes the boundary of the variable name unambiguous, especially
adjacent to other text (`"${var}_suffix"` vs. `"$var_suffix"`, which would
try to expand a variable literally named `var_suffix`).

**Testable assertion:**
No multi-character variable expansion in the project appears in the
unbraced `$var` form (single-character positional/special parameters like
`$1`, `$?`, `$@` are exempt).

**Source:**
[Google Shell Style Guide, "Variable expansion"](https://google.github.io/styleguide/shellguide.html#s5.6-variable-expansion).

---

### BASH-010

**Standard:**
All diagnostic and error messages are written to STDERR (file descriptor
2); STDOUT is reserved for a function's actual data output.

**Description:**
This separation lets a function's real return value be captured via
command substitution (`result=$(some_func)`) without diagnostic/log text
leaking into it. 

**Testable assertion:**
No `echo`/`printf` call that reports an error, warning, or log line omits a
`>&2` redirect (or an equivalent explicit stderr target), anywhere in the
project.

**Source:**
[Google Shell Style Guide, "STDOUT vs STDERR"](https://google.github.io/styleguide/shellguide.html#s3.1-stdout-vs-stderr) — *"All error messages should go to STDERR."*

---

### BASH-011

**Standard:**
Command substitution uses `$(command)`, never backticks.

**Description:**
Backtick substitution requires escaping nested backticks and doesn't
compose as cleanly when nested; `$(...)` nests trivially and is visually
unambiguous.

**Testable assertion:**
No backtick character (`` ` ``) appears anywhere in any of the three files.

**Source:**
[Google Shell Style Guide, "Command Substitution"](https://google.github.io/styleguide/shellguide.html#s6.2-command-substitution).

---

### BASH-012

**Standard:**
Executable availability is tested with `command -v`, not `which`.

**Description:**
`which` is an external, non-POSIX utility whose behavior and availability
vary across systems; `command -v` is a POSIX-standard shell builtin that
uses the same lookup the shell itself would.

**Testable assertion:**
The string `which ` does not appear anywhere in the project as an
executable-existence check.

**Source:**
[ShellCheck SC2230](https://www.shellcheck.net/wiki/SC2230) — *"`which` is non-standard. Use builtin `command -v` instead."*

---

### BASH-013

**Standard:**
A command's success/failure is checked directly (`if cmd; then` / `cmd ||
...`), not by running the command and later testing a bare `$?` on its own
line.

**Description:**
Testing `$?` on a separate line is fragile — any intervening command (even
a builtin) can overwrite it before it's checked. Where this project does
need to capture `$?` for logging purposes,
it's captured into a `local` variable as the *very first* statement inside
the failing branch, before anything else can overwrite it.

**Testable assertion:**
No standalone `if [[ $? -ne 0 ]]` (or equivalent) appears anywhere in the
project; every exit-status check is either part of the command's own
`if`/`||`/`&&`, or captures `$?` into a variable as the first statement of
the branch that needs it.

**Source:**
[ShellCheck SC2181](https://github.com/koalaman/shellcheck/wiki/SC2181) — *"Check exit code directly with e.g. `if mycmd;`, not indirectly with `$?`."*

---

### BASH-014

**Standard:**
Lists of command-line arguments (e.g. psql connection flags) are stored
and passed as bash arrays, never as a single space-delimited string.

**Description:**
A delimited string requires re-splitting on whitespace before use, which
breaks on any element containing a space or glob character. Arrays
preserve each element exactly and expand safely via `"${arr[@]}"`.

**Testable assertion:**
Every place in the project that builds a list of command-line arguments
for another program is declared
`local -a` and expanded with `"${name[@]}"`, never concatenated into a
plain string.

**Source:**
[Google Shell Style Guide, "Arrays"](https://google.github.io/styleguide/shellguide.html#s6.7-arrays).

---

### BASH-015

**Standard:**
Top-level program flow lives in a function named `main`, and the last
non-comment line of the script is `main "$@"`.

**Description:**
Putting top-level flow inside a function (rather than as bare top-level
code) lets it use `local` variables, keeps the file's functions grouped
together above any executable flow, and gives the script a single,
easy-to-find entry point.

**Testable assertion:**
All executable (non-library) scripts define a function named `main`, and the file's last
non-comment, non-blank line is exactly `main "$@"`.

**Source:**
[Google Shell Style Guide, "main"](https://google.github.io/styleguide/shellguide.html#s7.7-main).

---

### BASH-016

**Standard:**
Indentation is two spaces; no tabs.

**Description:**
Consistent, narrow indentation keeps deeply nested conditionals (common in
argument-parsing `case` statements) readable without excessive horizontal
scrolling.

**Testable assertion:**
No line in any of the three files begins with a tab character; nested
blocks are indented in increments of two spaces.

**Source:**
[Google Shell Style Guide, "Indentation"](https://google.github.io/styleguide/shellguide.html#s5.1-indentation).

---

### BASH-017

**Standard:**
Wherever multiple named flags are parsed, called, or documented together,
they appear in alphabetical order (by flag letter, case-insensitive).

**Description:**
This is a project-specific convention (not sourced from an external style
guide) adopted to make it easy to visually confirm that a flag list, a
`case` statement's arms, and a usage string all agree with each other, and
to make adding a new flag in the right place unambiguous. 

**Testable assertion:**
For every call site or `case` statement in the project that handles two or
more named (`-x=`/`--xyz=`) flags, the flags appear in strictly
alphabetical order left-to-right or top-to-bottom.

**Source:**
Project convention.

---

### BASH-018

**Standard:**
A script that needs its own directory (e.g. to `source` a sibling file)
resolves it via `${BASH_SOURCE[0]}`, not `$0`.

**Description:**
`$0` reflects how the *outermost* process was invoked and can be
misleading or wrong if the script is sourced from another script, or
invoked via a wrapper — `${BASH_SOURCE[0]}` always refers to the file
currently being executed/sourced, regardless of how it was reached.

**Testable assertion:**
No `dirname "$0"` (or equivalent use of bare `$0` for self-location)
appears anywhere in the project; `source` calls
use `${BASH_SOURCE[0]}`.

**Source:**
[Greg's Wiki, BashFAQ/028, "How do I determine the location of my script?"](https://mywiki.wooledge.org/BashFAQ/028).

---

### BASH-019

**Standard:**
A function `exit`s (terminating the whole process) only for failure modes
that indicate misuse or a condition requiring developer/operator
intervention to fix; it `return`s a non-zero status for outcomes a caller
could check and either handle or report.

**Description:**
This is a project-specific policy (not itself sourced externally, though
it's motivated by the general principle of checking return values)
adopted to make the failure-handling strategy predictable across the
library functions. 

**Testable assertion:**
For every non-zero-signaling code path in the project, a comment states
whether it's classified as "exit" (misuse) or "return" (checkable outcome)
and why; every `return 1`-based failure path has at least one caller that
inspects the resulting status.

**Source:**
Project convention (this document), informed by [Google Shell Style Guide, "Checking Return Values"](https://google.github.io/styleguide/shellguide.html#s8.1-checking-return-values) and the [GNU Bash Reference Manual's definition of exit status](https://www.gnu.org/software/bash/manual/bash.html#Exit-Status) (0–255, conventionally 0 = success).

---

### BASH-020

**Standard:**
Every function in library files (ex. `log_utils.sh`, `file_utils.sh`)
has a full header comment with sections for Description, Globals, Arguments, Outputs, and
Returns.

**Description:**
Library functions are consumed by code outside the file that defines
them, so a reader needs to understand the calling convention without
reading the implementation.

**Testable assertion:**
Every function in library files is preceded by a
comment block containing all five labels: `Globals:`, `Arguments:`,
`Outputs:`, and `Returns:` (plus a prose description).

**Source:**
[Google Shell Style Guide, "Function Comments"](https://google.github.io/styleguide/shellguide.html#s4.2-function-comments) — *"Any function in a library must have a function header comment regardless of length or complexity."*

---

### BASH-021

**Standard:**
External input is validated against an explicit allow-list pattern before
being interpolated into a string that will be interpreted by another
language or program (here, SQL passed to `psql`).

**Description:**
`pg_export_to_csv.sh`'s `-s=`/schema argument is interpolated directly
into a `SELECT ... WHERE schemaname = '...'` query and into a `\copy
"schema"."table"` command. Without validation, a value like `public';
DROP TABLE x; --` could break out of the intended query. This project
validates the schema name against `^[A-Za-z_][A-Za-z0-9_]*$` (a standard
SQL unquoted-identifier pattern) before it's used anywhere.

**Testable assertion:**
`main` rejects (exits nonzero, without ever invoking `psql`) any `-s=`
value that isn't a match for `^[A-Za-z_][A-Za-z0-9_]*$`.

**Source:**
General secure-coding practice; see the [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) for the underlying principle (allow-list validation of any input that crosses a language/interpreter boundary).

---

### BASH-022

**Standard:**
A function that accepts a nameref target name (to write an output value
back into the caller's scope) must not declare its own working variable
under that same name.

**Description:**
Bash resolves a nameref's target by name at the point of use; if the
defining function has its own local variable with the same name as the
string passed for the nameref, the nameref binds to that local instead of
reaching out to the caller's variable, and the value never propagates.

**Testable assertion:**
For every function that takes a nameref parameter, none of that function's
own local variable names match a plausible/likely name a caller might pass
as the nameref's target.

**Source:**
[GNU Bash Reference Manual, §6.7, "Shell Parameters" (`declare -n` / nameref semantics)](https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameters).

---

### BASH-023

**Standard:**
Every variable must have either an explicit default when it is declared, 
or is guaranteed to be assigned before read and
`set -u` (nounset) must be enabled for the whole program.

**Description:**
Under `set -u`, reading a variable that has never been assigned a value 
is a hard error ("unbound variable"). This is valuable precisely
because it turns "I forgot to handle this case" into an immediate, loud
failure instead of silently comparing against an empty string.
This standard is unmet when including a `local` declared with no `=value`,
an array declared but never populated,
or a nameref that was never bound to a target. 
This standard is also unmet when `set -u` is not enabled for any bash program.

**Testable assertion:**
The first line of executable scripts, after its header comment, is
`set -euo pipefail`. 

**Source:**
[GNU Bash Reference Manual, "The Set Builtin" (`-u`/`nounset`)](https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin) — *"Treat unset variables and parameters ... as an error when performing parameter expansion."* Also [Google Shell Style Guide, "Use Local Variables"](https://google.github.io/styleguide/shellguide.html#s7.5-use-local-variables), whose declare/assign-separately guidance this standard builds on.

---

### BASH-024

**Standard:**
Every function that takes more than one piece of data accepts it as named
`-x=value`/`--xyz=value` arguments parsed via a `for`/`case` loop rather
than as positional parameters (`$1`, `$2`, ...).

**Description:**
Positional parameters require the reader to cross-reference a function's
header comment (or its body) to know what `$3` means at any given call
site, and a call site that passes arguments in the wrong order fails
silently rather than loudly, since bash doesn't type-check positional
arguments. Named arguments make every call site self-describing --
`export_tables --outdir="${outdir}" --schema="${schema}" ...` is legible
without looking anything up, and reordering the arguments at a call site
has no effect. Functions that also need to forward an
arbitrary, variable-length list of arguments to another program (ex. `psql`,
in `test_connection`/`get_tables`/`export_tables`) still accept a trailing
unnamed remainder. Anything not matched by one of the function's own
`--flag=value` options is collected into an array and forwarded as-is.

**Testable assertion:**
No function in the project (other than `main`, which necessarily takes
raw CLI arguments as `$@`) reads `$1`, `$2`, etc. directly; every function
taking configuration data parses it out of `"$@"` via a `case` statement
matching `-x=*`/`--xyz=*` patterns, and every multi-argument call site
passes its named arguments in alphabetical order per
[BASH-017](#bash-017).

**Source:**
Project convention (this document); not externally sourced. The general
principle -- that self-describing call sites reduce the chance of
argument-order mistakes -- is a common justification for named/keyword
arguments across languages that support them (e.g. Rust, Typescript).
Since bash has no native equivalent, this project
implements the same idea by convention rather than language support.

---

### BASH-025

**Standard:**
At any call site that mixes named (`-x=`/`--xyz=`) arguments with
unnamed/positional ones, the named arguments come first and the
unnamed ones follow.

**Description:**
Several functions in this project accept a set of named flags plus one
trailing item that isn't itself a `--flag=value` pair. Ex. `create_file`'s
filename, `create_logfile`'s log-base-name, and
`test_connection`/`get_tables`/`export_tables`'s forwarded `psql`
arguments. Putting the named arguments first, consistently, 
means a reader scanning a call site
left-to-right sees what the call configures before what
gets passed through untouched. This standard creates consistency between
how functions are called and the how parsing loops themselves are written,
so that the call site's visual order mirrors the
parser's logical order.

**Testable assertion:**
For every call to library functions in the project, every `-x=`/`--xyz=`
argument appears to the left of every positional/unnamed argument in that
same call.

**Source:**
[POSIX.1-2017, "Utility Syntax Guidelines", Guideline 9](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) — *"All options should precede operands on the command line."*

---

### BASH-026

**Standard:**
Across the whole project, exit code `0` means success, `1` means a
retryable error (the operator can fix the environment/input and re-run
the exact same command), and `2` means a fatal error (the *code* needs to
change before re-running would help).

**Description:**
This convention is stated at the top of `README.md` and applies to every
script and library function in the project. It gives a caller (a human,
or a wrapping script/CI job) a way to distinguish "try again after fixing
something external" from "this needs a developer" without having to parse
the log message. 

**Testable assertion:**
Every `exit` call in the project uses `0`, `1`, or `2`; every `exit 1`
corresponds to a condition where re-running the identical command after
fixing external state (environment, credentials, arguments) would be
expected to succeed; every `exit 2` corresponds to a condition where
re-running the identical command would fail again identically until the
source code itself changes.

**Source:**
Project convention, as documented at the top of this project's
`README.md`; not externally sourced.
