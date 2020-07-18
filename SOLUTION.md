# Solution Docs

<!-- You can include documentation, additional setup instructions, notes etc. here -->

First, I have created httpservice to use superagent easily in the Autocomplete class.

I have implemented httpservice to onQueryChange function using JS promise structure. After the request is finished,
by using prepareRequestedResults function, I have filtered the result and then I have called the same function that you 
implemented (updateDropdown) to update the dropdown list.

For task 2, I have chosen the input search box to handle up and down keys since the user may continue to type
the rest of the word or remove some of the characters. By adding onKeyDown event to the input box, I have handled
the arrow keys and by keeping the index of the item, I can handle the Enter event to select the result item.
I called the click event to handle it easily.

And for the last task If I don't get wrong, I just added query params to URL like localhost:8080?q={query}
so it can look like Google while clicking or pressing enter on the dropdown item. 

I have added all these properties at Autocomplete.js so, multiple instances of the component on the same page can be handled. 