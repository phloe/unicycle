# unicycle

> Minimalist unidirectional data flow for CRUD

Unicycle minimizes the amount of boilerplate needed to get a [Flux](https://facebook.github.io/flux/docs/overview.html#content) flow up and running.
You get basic [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
support for free as data in all stores are treated as arrays. 

No constants are used - instead **action types** are autogenerated from **store** and
**action creator method** names (eg. a store named `book` and an action creator method named `rate` would yield an action type of `BOOK_RATE`).


## Usage

```js
// ./unicycle.js
var Unicycle = require("unicycle");

module.exports = new Unicycle(); // Create a unicycle instance.


// ./stores/BookStore.js
var unicycle = require("../unicycle");

module.exports = unicycle.crudStore("book", function (data) {
	return {
		title: data.title || "Untitled",
		author: data.author || "anonymous",
		published: data.published || null;
	};
});


// ./actions/BookActions.js
var unicycle = require("../unicycle");

module.exports = unicycle.crudActions("book");


// ./index.js
var React = require("react");
var App = require("./components/App");
var BookStore = require("./stores/BookStore");
var BookActions = require("./actions/BookActions");
var data = require("./data/books.json"); // Get data from somewhere.

BookStore.register(render); // Register a function to be called on changes.

BookActions.read(data); // Read data into store via action.

function render () {
	var books = BookStore.getAll();
	React.render(<App books={books} />, document.body);
}
```


## API

### Unicycle
This is the main API for unicycle. Simply create a single instance to use throughout your app.

##### Returns
(Object) - A Unicycle instance.

##### Example
```js
var Unicycle = require("unicycle");

module.exports = new Unicycle();

```


### unicycle

* [dispatcher](#unicycledispatcher)
* [actions](#unicycleactions)
* [crudActions](#unicyclecrudactions)
* [store](#unicyclestore)
* [crudStore](#unicyclecrudstore)


#### [unicycle].dispatcher
The Flux dispatcher instance.

#### [unicycle].actions
Creates an object with action creator methods.

##### Arguments

* `name` (String) - A name that is used to identify the action creators.
* `signatures` (Object) - An object describing the signature of the action creators to be created. The keys will be turned into names of methods and values turned into arguments signature of said methods.

##### Returns
(Object) An object with action creator methods.

##### Example
```js
var BookActions = unicycle.actions("book", {rate: ["id", "rating"]});

/*
BookActions == {
	rate: function (id, rating) { ... }
}
*/

// Later on...

BookActions.rate(book.id, 3);

// The dispatcher would then send the following action to stores:
// {type: "BOOK_RATE", id: "id-of-that-book", rating: 3}
```



#### [unicycle].crudActions
An extension of [[unicycle].actions](#unicycleactions) that will automatically include the signatures for basic CRUD actions:

```js
{
	create: function,
	read: ["data"],
	update: ["id", "data"],
	delete: ["id"]
}
```

You can override the included signatures as you like.

##### Arguments
See [[unicycle].actions](#unicycleactions). The `signatures` argument becomes optional.

##### Returns
(Object) An object with action methods.



#### [unicycle].store
Creates a store with handlers for actions.

##### Arguments

* `name` (String) - A name to identify the store.
* `handlers` (Object) - And object with handler functions for reacting to actions. In handlers `this` refers to the [Store](#store) instance.
   If you want the store to handle action types other than from action creators of the same `name` - simply name the handlers with full action types: uppercased `name + "_" + method`, eg. action creator named `"author"` and a method named `"wrote"` would be predefined as `"AUTHOR_WROTE"`.

##### Returns
(Object) A [storefront](#storefront) object.



#### [unicycle].crudStore
Creates a store with handlers for actions - but with added handlers for CRUD:

```js
{
	create: function (action) {
		/* creates new store item using `create` with added `id`, `c_time` and `m_time` properties */
	},
	read: function (action) {
		/* read data into store items */
	},
	update: function (action) {
		/* update existing item via `id` - including autoupdate of `m_time` */
	},
	delete: function (action) {
		/* delete item from store items via `id` */
	}
}
```

##### Arguments
* `name` (String) - A name to identify the store.
* `create` (Function) - Optional. A function to create items in the store. If not supplied raw data is used for item initiation.
* `handlers` (Object) - Optional. See [[unicycle].store](#unicyclestore).

##### Returns
(Object) A [storefront](#storefront) object.



### storefront

* [dispatchToken](#storefrontdispatchtoken)
* [get](#storefrontget)
* [getAll](#storefrontgetall)
* [register](#storefrontregister)
* [unregister](#storefrontunregister)



#### [storefront].dispatchToken
Token used to identify the store in [Dispatcher.waitFor](https://facebook.github.io/flux/docs/dispatcher.html#content).



#### [storefront].get
A method that will find an item.

##### Arguments

* `id` Id of the item to find.

##### Returns
(Object) An item from the store.



#### [storefront].getAll
Returns the items currently in the store.

##### Returns
(Array) The items from the store.



#### [storefront].register
Register functions to be executed on changes.

##### Arguments

* `func` (Function) - The function to be executed once a change has happened.



#### [storefront].unregister
Unregister a function from being executed on changes.

##### Arguments

* `func` (Function) - The function to be unregistered.


### Internal API
The following describes the internal API that isn't exposed through `unicycle` - but may be useful to understand.


#### Store


##### Arguments

* `name` (String) - A name to identify the store.
* `handlers` (Object) - See [[unicycle].store](#unicyclestore).
* `dispatcher` (Object) - An Flux dispatcher instance.

##### Returns
(Object) - A Store instance.



#### store instance

* [dispatchToken](#storedispatchtoken)
* [handlers](#storehandlers)
* [items](#storeitems)
* [emitChange](#storeemitchange)
* [get](#storeget)



#### [store].dispatchToken
The token assigned to the store from the dispatcher.



#### [store].handlers
The action handlers attached to the store.



#### [store].items
The list of items in the store.



#### [store].emitChange
A method to trigger a change event to execute any registered function.



#### [store].get
A method that will find an item.

##### Arguments

* `id` Id of the item to find.

##### Returns
(Object) An item from the store.


