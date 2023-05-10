# HeartLab Coding Test - Writeup

## Instructions

Added a few more test cases, just run `npm run test`

## Architectural Summary & Justification

### Summary

The current design is to using a map to store the `Opening Hours` data, the data structure would be something like this:

```
{
  "dayInNumber:HourInNumber": ["clinic1", "clinic2"],
  ...
}
```

The key is composed by two parts (day in number and hour in number), and connected with a `:`. The value is a list of clinic name strings, which is the query result we want.
The maximum numbers of keys is 7 (days) \* 24 (hours) = 168.

### Why this design

First thing cross my mind is that it could be two path I can go:

1.  Inherit most of the existing strucuture of the example data. Just transforming the opening hours string into a map or list.
2.  The clinic opening hours are usually scheduled by the hour. We could divide the week into hours, and put the clinic name into those time slot.

Use existing structure will consume less storage space, and the cost of saving data would be relatively cheap. However, assuming there are `n` clinics in the dataset, and each clinic has `m` opening hours then the cost of query will be like `O(nm)` which is very expensive especailly when it's frequently being called.

For the current solution, clinic names need to be stored in different time slot. And for the worst case (if a clinic opens 24/7), its name will need to be stored 168 times. Definitely more storage space will be consumed. However the query cost for this solution is `O(1)`, since basically the name already been put into the place, and only need to sort the data while querying.

Considering the clinic opening hours would not likely be changed often, and the querying cost is cheaper, I use the second solution in this assessment.

## Scalability

For larger datasets, saving data process or data migration will probably consume more time and space. But querying data would not be affected (O(1))

## Further Work

1. Currently, extracting data from example dataset is still a bit time consuming. In the future, we might want to concider to put the extracted data into a secondary database (or a in-memory database like Redis), and connect them with an event driven flow. Once an update event is happened to the example dataset, it will trigger an update action just for the changed data.

2. Some code refactors might also needed. e.g, putting types, utils method into seperated files.

3. Current solution assumed clinic opening hour scheduled by the hours, might meet edge cases that opening hour scheduled by half an hour or even quarter of an hour. then will need to adjuest the logic to adapt those scenarios.
