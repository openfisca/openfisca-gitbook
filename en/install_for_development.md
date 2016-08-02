# Install for Development


Follow these steps if you plan to develop on OpenFisca-France or OpenFisca-Core.


### Clone git repositories

You need [Git](http://www.git-scm.com/) tool to be installed on your system.

It is important to have your "openfisca" Conda environment [activated](http://conda.pydata.org/docs/test-drive.html#managing-environments) starting from now:

```
source  activate  openfisca
```

Create a working directory like `~/Dev/openfisca` and go inside.

> If you need to modify **OpenFisca-Core** source code, follow the [install for development](https://github.com/openfisca/openfisca-core#install-for-development) section before completing the step below. By default just continue below.

Install OpenFisca-France from Git:

```
git clone https://github.com/openfisca/openfisca-france.git
cd openfisca-france
pip install --editable .
python setup.py compile_catalog
```

OpenFisca-Core should be installed automatically as a requirement of OpenFisca-France.

Run `conda list` to see the installed packages: `openfisca-core` and `openfisca-france` should be listed.

### Create a virtualenvironnement

We recommend to use a virtualenv with [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/) in order to solve dependancies and versions problems of packages used by Openfisca.

```
pip install virtualenvwrapper
```

## Test the installation

To test if OpenFisca-France is correctly installed:

```bash
python -m openfisca_france.tests.test_basics
```

It should display (this could take one or two minutes):

```
OpenFisca-France basic test was executed successfully.
```

This means that OpenFisca is correctly installed on your machine.

The next step for you is to read the [Coding the legislation](../coding-the-legislation/index.html) section to know how to write legislation.

> If you want to use your local installation as an API (instead of importing it in python scripts), install **OpenFisca Web API** with [these instructions](https://github.com/openfisca/openfisca-web-api#install).

## Without Conda

Conda is not a strong requirement! To install the requirements of the installed packages, you can either:

- install them with your operating system package manager (`apt-get` on Debian, `brew` on Mac OS X, etc.)
- install them with `pip install` with or without a virtualenv

It's up to you to choose what suits you the best.