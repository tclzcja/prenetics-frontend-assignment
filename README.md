# prenetics-frontend-assignment

Testing methods for each step:

## Create a Patient Management page for organisation Prenetics to display and paginate test results (15 results per page).

I initialized the project and implemented a quick Patient Management page using the screenshot as reference.

The mocking data I'm getting from API has only 5 rows, so to test pagination function I need to manually duplicate those data for testing. (Line 43, PagePatientManagement.vue)

## Implement search functionality for the Patient Management page

To test the search/keyword function, simply input a unique value from the specific column and see whether only the rows having the specific value exists in the table.

For example input unique patient ID parts "0bf3" and only user "Andrew Lau" will remain.

## For organisation Circle, the Patient Management page should view the following properties in addition to those from Question 1

In order to switch between organisations, a drop-down needs to be implemented. Simply observe whether the extra table columns exists for organisation "Circle" only will do the test.

## For organisation Circle, the Patient Management page should also be able to search by patient ID

Similar to above, input a unique substring of patient ID under organsation "Circle" and "Prenetics" should result in different table rows (results).

In other words, when under "Circle", search for "b66d" should display all results for "Peter Chan", but under "Prenetics" it should return nothing (because patient ID column does NOT display for Prenetics).
