# Periods

A period can be a month, a year, `n` successive months or `n` successive years.


## Periods for variable

Most of the quantities calculated in openfisca can change over time. Therefore, each formula calculates a variable for a person (or a family, etc.) **for a given period**.

This period is always the second argument of the formulas :

```py
class var(Variable):
    column = FloatCol
    entity = Person
    label = u"some variable"
    definition_period = MONTH

    def function(person, period):
        ...
```

The size of the period is constrained by the class attribute `definition_period` :
  - `definition_period = MONTH` : The variable may have a different value each month. For example, the salary of a person. The parameter `period` is guaranteed to be a whole month.
  - `definition_period = YEAR` : The variable is yearly or has always the same value every month. For example, The input of a yearly declaration. The parameter `period` is guaranteed to be a whole year (from january 1st to 31th december).
  - `definition_period = ETERNITY` : The value of the variable is constant. For example, the date of birth of a person never changes. There is no guarantee about `period` which must not be used.


## Calculating dependencies for a period different than the one they are defined for

Calling a formula with a period that is incompatible with the attribute `definition_period` will cause an error. For instance, if we assume that a person `salary` is paid monthly:

```py
class var(Variable):
    column = FloatCol
    entity = Person
    label = u"some yearly variable"
    definition_period = YEAR

    def function(person, period):
        salary_past_year = person('salary', period) # THIS WILL BREAK !
        ...
```

However, sometimes, we do need to estimate a variable for a different period that the one it is defined for.

We may for example want to get the sum of the salaries perceived on the past year, or the past 3 months. The `ADD` option allows you to do it:

```py
class var(Variable):
    column = FloatCol
    entity = Person
    label = u"some yearly variable"
    definition_period = YEAR

    def function(person, period):  # period is a year because definition_period = YEAR
        salary_last_year = person('salary', period, options = [ADD])
        salary_last_3_months = person('salary', period.last_3_months, options = [ADD])
        ...
```

The `DIVIDE` option allows you to do the opposite: evaluating a quantity for a month while the variable is defined for a year. For instance, in the following example, `yearly_tax_projected` will contain the value of `some_yearly_tax` for the year including `period` divided by 12.

```py
class var(Variable):
    column = FloatCol
    entity = Person
    label = u"some monthly variable"
    definition_period = MONTH

    def function(person, period):  # period is a month because definition_period = MONTH
        tax_projected = person('some_yearly_tax', period, options = [DIVIDE])
```


## Calculating dependencies for a specific period

It happens that the formula to calculate a variable at a given period needs the value of another variable for another period. Usually, the second period is defined relatively to the first one (previous month, last three month, current year).

For instance:

```py
class var(Variable):
    column = FloatCol
    entity = Person
    label = u"some variable"
    definition_period = YEAR

    def function(person, period):
        salary_this_month = person('salary', period.this_month)
        salary_last_month = person('salary', period.last_month)
        salary_6_months_ago = person('salary', period.offset(-6, 'month'))
```

You can generate any period with the following properties and methods:

| Period                            | Meaning                                                      |
|-----------------------------------|--------------------------------------------------------------|
| `period.this_month`               | First month-length period that includes the start of `period`|
| `period.last_month`               | Month preceding `period.this_month`                          |
| `period.this_year`                | First year-length period that includes the start of `period` |
| `period.last_year`                | Year preceding `period.this_year`                            |
| `period.n_2`                      | 2 years before `period.this_year`                            |
| `period.last_3_months`            | The three-month period preceding `period.this_month`         |
| `period.offset(n, 'month')`       | `period` translated by n months (backwards if n <0)          |
| `period.offset(n, 'year')`        | `period` translated by n years (backwards if n <0)           |
| `period.start.period('year')`     | Year-long period starting a the same time than `period`      |
| `period.start.period('month')`    | Month-long period starting a the same time than `period`     |
| `period.start.period('year', n)`  | n-year-long period starting a the same time than `period`    |
| `period.start.period('month', n)` | n-month-long period starting a the same time than `period`   |

You can find more information on the `period` object in the [reference documentation]() (_not available yet_)