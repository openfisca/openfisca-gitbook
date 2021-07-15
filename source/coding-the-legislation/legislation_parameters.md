# Parameters

[Legislation parameters](../key-concepts/parameters.md) can be found in the `parameters` directory of your country package.

The parameters are organized with in a [tree structure](https://en.wikipedia.org/wiki/Tree_structure).

>**Example**: `tax_on_salary.public_sector.rate` can be found in `parameters/tax_on_salary/public_sector/rate.yml`.

Example of a `parameters` directory:
* parameters
  * tax_on_salary
    * **tax_scale.yaml**
    * public_sector
      * **rate.yaml**
  * universal_income
    * **minimum_age.yaml**
    * **amount.yaml**


In this file structure:
 - `tax_on_salaries`, `tax_on_salary.public_sector`, `universal_income` are **nodes**;
 - `tax_on_salaries.tax_scale`, `tax_on_salary.public_sector.rate`,`universal_income.minimum_age`,`universal_income.amount` are **parameters** (or scales).

## How to write a new parameter
> if you wish to update a parameter, read our [legislation evolution page](./40_legislation_evolutions.md).

1. Find where the parameter fits

A parameter is located inside a **node**, that has the same name as the directory it is contained in.
>**Example**: `tax_on_salary.public_sector` is the node that contains the `tax_on_salary.public_sector.rate`parameter.

2. Create a new parameter YAML file

A legislative parameter is defined by a YAML file of the same name. Possible attributes are:
* `description` (optional) Description;
* `metadata` (optional) Can be:
  * `reference` (optional) Legislative reference;
  * `unit` (optional) Can be:
    * `year`: The values are years;
    * `currency`: The values are in the unit of currency of the country;
    * `/1`: The values are percentages, with `1.0`=100%;
* `values`: Value of the parameter for several dates.

Sample file `parameters/universal_income/amount.yaml`
```yaml
description: Universal income
metadata:
  unit: currency
values:
  1993-01-01:
    value: 1000
  2010-01-01:
    value: 1500
    metadata:
      reference: http://law.reference.org/universal_income
  2020-01-01:
    expected: 1700
```

In this example, the parameter `universal_income.amount` is:
* undefined before 1993;
* equal to 1000 from 1993 to 2010;
* equal to 1500 in 2010
* expected to be raised to 1700 "local currency" in 2020.

The ordering of the dates has no effect. It is recommended to add legislative references for every value?

3. Use the parameter in a variable

See [this example of a variable using legislation parameters](./10_basic_example.md#example-with-legislation-parameters).

### Naming conventions and reserved words

Names should begin with a lowercase letter and should contain only lowercase letters and the underscore (`_`).

The following keywords are reserved and should not be used as names : `description`, `reference`, `values`, `brackets`.

YAML parameter files should not be name `index.yaml`.

### Advanced uses

#### Defining parameter nodes in a YAML file

A node can be defined with a YAML file instead of a directory. In such a case, the name of the file defines the name of the node. Such a file can define children nodes (which can define grandchildren...).

Sample `parameters/tax_on_salary.yaml`:

```yaml
description: Tax on salaries
metadata:
  reference: http://fiscaladministration.government/tax_on_salaries.html
tax_scale:
  bracket:
    ...
public_sector:
  description: Tax on salaries for public sector
  rate:
    values:
     ...
```

#### Creating scales

Scales are complex parameters constituted of brackets. They offer convenient built-in tools for recurring calculation patterns.

For instance, a marginal rate test scale can be defined in a YAML file with:

File `parameters/tax_on_salary/tax_scale.yaml`
```yaml
description: Scale for tax on salaries
brackets:
  - rate: # Define a 1st bracket
      1950-01-01:
        value: 0.0  # The rate applied to the first bracket was 0% from 1950 to 2009
      2010-01-01:
        value: 0.02  # The rate applied to the first bracket has changed to 2% in 2010
    threshold:
      1950-01-01:
        value: 0.0
  - rate: # Define a 2nd bracket
      1950-01-01:
        value: 0.2  # The rate applied to the second bracket has been 20% since 1950
    threshold:
      1950-01-01:
        value: 2000  # The 2nd bracket starts for wages beyond 2000
metadata:
  type: marginal_rate
  threshold_unit: currency-EUR
  rate_unit: /1
```

It can then be used in a formula with:
```py
def formula(person, period, parameters):
    salary = person('salary', period)
    scale = parameters(period).tax_on_salary.tax_scale
    return scale.calc(salary)
```

If `salary` is `3000` and period is `2015-06`, the output of the formula will be `2000 * 0.02 + 1000 * 0.2`


The scales built-in OpenFisca are:
- Marginal rate scale:
  - Split the input into several brackets according the thresholds, and apply the corresponding rate to each bracket
  - See previous example
- Marginal amount tax scale:
  - Matches the input amount to a set of brackets and returns the sum of cell values from the lowest bracket to the one containing the input
  - Defined as in the previous YAML example, but replacing `rate` by `amount`, and setting `type` to `marginal_amount` to the parameter's metadata
- Single amount tax scale:
  - Matches the input amount to a set of brackets and returns the single cell value that fits within that bracket
  - Defined as in the previous YAML example, but replacing `rate` by `amount`, and setting `type` to `single_amount` to the parameter's metadata


Example: [the french tax scale on income](https://fr.openfisca.org/legislation/impot_revenu.bareme)

#### Ending a parameter at a specific date

It is possible to end a parameter at a specific date simply by entering **null** as a value for that date.

In the following example, the `housing allowance` is only defined from the 1st of January 2010 to the 30th of November 2016:

File `parameters/benefits/housing_allowance.yaml`

```yaml
description: Housing allowance amount (as a fraction of the rent)
metadata:
  unit: /1
  reference: https://law.gov.example/housing-allowance-rate
documentation: |
  A fraction of the rent.
  From the 1st of Dec 2016, the housing allowance no longer exists.
values:
  # This parameter is only defined from the 1st of Jan 2010 to the 30th of Nov 2016.
  2010-01-01:
    value: 0.25
  2016-12-01:
    value: null
```

Calling the parameter for a period after the 30th of November 2016, **2017** for instance, will render an error:

> Example:
>```py 
>tax_benefit_system.parameters(2017).benefits.housing_allowance
>```
> Output:
>```py
>ParameterNotFoundError: The parameter 'benefits[housing_allowance]' was not found in the 2017-01-01 tax and benefit system.
>```


The same thing can be done for a scale by adding a **null** value for that date across all rates.

The following example from `openfisca-france`, ends the `Sécurité sociale/ Maladie, maternité` parameter in the 31st of December 2012.

File `parameters/cotsoc/sal/comind/maladie.yaml`

```yaml
brackets:
- rate:
    2003-01-01:
      value: 0.065
    2012-01-01:
      value: 0.06
    2013-01-01:
      value: null
  threshold:
    2003-01-01:
      value: 0.0
- rate:
    2003-01-01:
      value: 0.059
    2013-01-01:
      value: null
  threshold:
    2003-01-01:
      value: 1.0
    2013-01-01:
      value: null
- rate:
    2003-01-01:
      value: 0.0
    2013-01-01:
      value: null
  threshold:
    2003-01-01:
      value: 5.0
    2013-01-01:
      value: null
description: Sécurité sociale/ Maladie, maternité
```


#### Computing a parameter that depends on a variable (fancy indexing)

Sometimes, the value of a parameter depends on a variable (e.g. a housing benefit that depends on the zone the house is built on).

To be more specific, let's assume that:
  - Households who rent their accomodation can get a `housing_benefit`
  - The amount of this benefit depends on which `zone` the household lives in. The `zone` can take only three values: `zone_1`, `zone_2` or `zone_3`.
  - The amount also depends on the composition of the household.

The parameters of this benefit can be defined in a `housing_benefit.yaml` file:

```YAML
zone_1:
  single:
    description: "Amount of housing benefit for a single person, in zone 1"
    values:
      2015-01-01:
        value: 150
  couple:
    description: "Amount of housing benefit for a couple, in zone 1"
    values:
      2015-01-01:
        value: 250
  per_child:
    description: "Amount of housing benefit per child, in zone 1"
    values:
      2015-01-01:
        value: 80
zone_2:
  single:
    description: "Amount of housing benefit for a single person, in zone 2"
    values:
      2015-01-01:
        value: 120
  couple:
    description: "Amount of housing benefit for a couple, in zone 2"
    values:
      2015-01-01:
        value: 220
  per_child:
    description: "Amount of housing benefit per child, in zone 2"
    values:
      2015-01-01:
        value: 60
zone_3:
  single:
    description: "Amount of housing benefit for a single person, in zone 3"
    values:
      2015-01-01:
        value: 100
  couple:
    description: "Amount of housing benefit for a couple, in zone 3"
    values:
      2015-01-01:
        value: 180
  per_child:
    description: "Amount of housing benefit per child, in zone 3"
    values:
      2015-01-01:
        value: 50
```

Then the formula calculting `housing_benefit` can be implemented with:

```py
def formula(household, period, parameters):
  is_couple = household('couple', period)
  nb_children = household('nb_children', period)
  zone = household('zone', period)

  P = parameters(period).housing_benefit[zone]

  return where(is_couple, P.couple, P.single) + nb_children * P.per_children
```

`parameters(period).housing_benefit[zone]` return the parameters for the zone corresponding to the household.

If there are many households in your simulation, this parameter will be **vectorial** : it may have a different value for each household of your entity.

To be able to use this notation, all the children node of the parameter node `housing_benefit` must be **homogenous**. In the previous example, `housing_benefit.zone_1`, `housing_benefit.zone_2`, `housing_benefit.zone_3` are homogenous, as they have the same subnodes.

However, let's imagine that `housing_benefit.yaml` had another subnode named `coeff_furnished`, which described a coefficient to apply to the benefit is the accomodation is rented furnished:

`housing_benefit.yaml` content:

```
coeff_furnished:
  description: "Coefficient to apply if the accomodation is rented furnished"
    values:
      2015-01-01:
        value: 0.75
zone_1:
  single:
    description: "Amount of housing benefit for a single person, in zone 1"
    values:
      2015-01-01:
        value: 150
(...)
```

In this case, `parameters(period).housing_benefit[zone]` would raise en error, whatever `zone` contains, as **the homogeneity condition is not respected**: `housing_benefit.zone_1` is a node, while `housing_benefit.coeff_furnished` is a parameter.

To solve this issue, the good practice would be to create an intermediate node `amount_by_zone`:

`housing_benefit.yaml` content:

```
coeff_furnished:
  description: "Coefficient to apply if the accomodation is rented furnished"
    values:
      2015-01-01:
        value: 0.75

amount_by_zone:
  zone_1:
    single:
      description: "Amount of housing benefit for a single person, in zone 1"
      values:
        2015-01-01:
          value: 150
  (...)
```

And then to get `parameters(period).housing_benefit.amount_by_zone[zone]`

## How to navigate the parameters in Python

Set-up your python file by importing a `country package` and building the `tax and benefits system`

> Example :
> ```
> import openfisca_country_template
> tax_benefit_system = openfisca_country_template.CountryTaxBenefitSystem()
> ```

### Access a parameter for all periods

To access a point in the parameter tree, call `tax_benefit_system.parameters`
> Example :
> Access the `benefit` branch of the `openfisca-country-template` legislation
> ```py
> tax_benefit_system.parameters.benefits
> ```
> Returns:
> ```sh
> basic_income:
>     2015-12-01: 600.0
> housing_allowance:
>   2016-12-01: None
>   2010-01-01: 0.25
> ```
>
> Access `basic_income`, a parameter of the `benefits` branch.
> ```py
> tax_benefit_system.parameters.benefits.basic_income
> ```
> Returns:
> ```sh
> 2015-12-01: 600.0
> ```

### Access a parameter for a specific period

Request a branch of a parameter at a given date with the `parameters.benefits('2015-07-01')` notation.

## How to update parameters in python

To add an entry to an existing parameter, use `update`:

> Example:
> ```py
> tax_benefit_system.parameters.benefits.basic_bro.update("2017-01", value = 2000)
> tax_benefit_system.parameters.benefits.basic_bro
> ```
> Returns:
> ```sh
> 2017-01-01: 2000
> 2015-12-01: 600.0
>```
