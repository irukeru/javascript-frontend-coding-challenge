var HTTPService = require('./httpservice');

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [], isLocal: true, queryURL: "" }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  onQueryChange(query, isLocal) {
    // Get data for the dropdown
    if (isLocal) {
      let results;

      results = this.getResults(query, this.options.data);
      results = results.slice(0, this.options.numOfResults);

      this.updateDropdown(results);
    } else {
      // prepare params for the reuqest
      let queryParams = {
        q: query,
        per_page: this.options.numOfResults
      };

      // now its time to fetch data with http request
      this._httpService.get(this.options.queryURL, queryParams)
            .then(resp => {
              // we need to wait for end of the http request to prepare the results.
              if (resp.body && resp.body.items) {
                this.updateDropdown(this.prepareRequestedResults(resp.body.items));
              }
            })
            .catch(error => {
              console.log(error);
            });
    }
  }

  /**
   * 
   * we need to prepare result array that we have requested from url for our structure.
   */
  prepareRequestedResults(results) {
    let userNameList = [];

    results.forEach(result => {
      userNameList.push({ text: result.login, value: result.id});
    });
    return userNameList;
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  onKeyDown(event, results) {

    let list = this.listEl.getElementsByClassName("result");

    switch(event.key) {
      case "ArrowDown":
        if(this.selectedListItem > -1) {
          list[this.selectedListItem].classList.remove("selected");

          if (this.selectedListItem < list.length - 1) {
            this.selectedListItem += 1;
          } else {
            this.selectedListItem = 0;
          }

          list[this.selectedListItem].classList.add("selected");  
        } else {
          this.selectedListItem = 0;
          list[this.selectedListItem].classList.add("selected");
        } 
        break;

      case "ArrowUp":
        if(this.selectedListItem > -1) {
          list[this.selectedListItem].classList.remove("selected");
          if (this.selectedListItem > 0) {
            this.selectedListItem -= 1;
          } else {
            this.selectedListItem = list.length - 1;  
          }

          list[this.selectedListItem].classList.add("selected");
        } else {
          this.selectedListItem = list.length - 1;
          list[this.selectedListItem].classList.add("selected");
        }
        break;

      case "Enter":
        if (this.selectedListItem > -1) {
          window.location.href = 'http://localhost:8080/?q=' + list[this.selectedListItem].innerText;
        }
        break;
    }
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') {
          this.inputEl.value = result.text;
          onSelect(result.value);
        }
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl(isLocal) {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    inputEl.addEventListener('input', event =>
      this.onQueryChange(event.target.value, isLocal));

    inputEl.addEventListener('keydown', event => 
      this.onKeyDown(event));

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl(this.options.isLocal);
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);

    this.selectedListItem = -1;


    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('q')) {
      this.inputEl.value = urlParams.get('q');
    } 

    this._httpService = new HTTPService.HttpService;
  }
}
