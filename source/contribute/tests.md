# Tests

OpenFisca has two sorts of tests:

* unit tests
* test-case tests

## Run tests

OpenFisca uses [nose](https://nose.readthedocs.org/) to run its unit tests. Here are some useful commands.

- Run the whole test suite:
    ```
    make test
    ```
    which is available at least in Core, France and Web-API repositories.
- Run a specific test:
    ```
    nosetests openfisca_france/tests/test_parameters.py
    ```
- Hide log of failing test:
    ```
    nosetests --nologcapture openfisca_france/tests/test_parameters.py
    ```
- Display log of successful test:
    ```
    nosetests --debug=openfisca_core openfisca_france/tests/test_parameters.py
    ```

## YAML tests

Formulas are tested with [YAML tests](../coding-the-legislation/writing_yaml_tests.md).


## ipdb debugger

If a test fails, you can execute it with the [debug](https://nose.readthedocs.org/en/latest/plugins/debug.html) nose plugin:

```bash
nosetests --pdb openfisca_core/tests/test_tax_scales.py
```

You'll be dropped in the `pdf` debugger shell when an error occurs.

You can [specify the exact test to launch](https://nose.readthedocs.org/en/latest/usage.html#selecting-tests):

```bash
nosetests --pdb openfisca_core/tests/test_tax_scales.py:test_linear_average_rate_tax_scale
```

> The [nose-ipdb](https://github.com/flavioamieiro/nose-ipdb/) plugin is more user-friendly
> (because it uses the [ipdb](https://github.com/gotcha/ipdb) debugger instead of pdb).
> In this case, just use the `--ipdb` option rather than `--pdb`.
> See also the `--ipdb-failure` option.

In case you want to set a breakpoint manually, in order to enter the debugger shell before an errors occurs,
copy-paste this line in your code:

```python
import nose.tools; nose.tools.set_trace(); import ipdb; ipdb.set_trace()
```

This needs [ipdb](https://github.com/gotcha/ipdb) to be installed.

> Hint: use the snippets feature of your favorite text editor to save this line, for example give it the name "breakpoint".

## Continuous integration

All OpenFisca official packages are continuously tested. All tests run automatically after each `git push`.
