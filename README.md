# Redux Envelope

## It completly removes the Redux's boilerplate it had been always critcized for, no need to write any action creator or any reducer.

Redux Envelope is an extension on top of `@vitwit/js-sdkgen.`

It does one extra things from `js-sdkgen`.

- It will generate sdk class which accepts `dispatch` function while initiating. This `dispatch` should from the same store instance you are providing to `react-redux`.
- Every method's response will be stored in the sdk reducer with method's name appended with 'Res' for example `getUsers` response will be stored as `getUserRes`.

Given the swaggger.json file in root folder of the repo, running below command will generate the code in sdk folder of the repo.

```sh
redux-envelope --json-file swagger.json  --name myApp --version 1.0.0 --base-url="https://vitwit.com" --required-headers name,lastname --optional-headers token --with-redux-configs
```

**Follow the below steps to configure**

> in file where you configure react store for example `src/redux.js`

```js
import { store, createStore, combineReducers } from "redux";

import  { myAppReducer }  from "./sdk/reducer";

store.createStore(combineReducers({ myAppReducer }));
const disptach = store.dispatch;
export store;
//export dispatch, exporting it from here make sure you don't pass from other instance of store to the sdk class while initiating
export {dispatch};
```

> in file where initiate your SDK class with dispatch and headers for example in `src/sdk/index.js`

```js
import { dispatch } from "../redux";
import MyApp from "./myApp";
const myApp = new MyApp(dispatch, { requiedParams1: "" });
export { myApp };
```

> in any component in your app for example `App.js`

```js
import react from "react";
import { myApp } from "./sdk";
import { connect } from "react-redux";

class App extends React.Component {
  componentDidMount() {
    myApp.addPet({
      name: "dlf"
    });
  }
  render() {
    const { addPetRes } = this.props;
    // you will get loading state managed by sdk itself.
    const { loading, data, error } = addPetRes;
    if (Loading) {
      return <div>loading...</div>;
    }
    if (error) {
      return <div>Ooops...Unexpected shit happening</div>;
    }
    return <div>{data.something}</div>;
  }
}
const mapState = ({ myAppReducer }) => ({
  addPetRes: myAppReducer.addPetRes
});
export default connect(mapState)(App);
```

### Bonus

When using sdk, most probably you don't have to map any action creator in `mapDispatchToProps` and also you will mostly consuming only sdk reducer in mapStateToProps function.
If this is the case `sdk/reducer` file also export a helper function `connect` to which you can pass a array of keys you want your component to re-render on change. It eliminates the need of write a mapStateToProps function. You can use it as normal connect also, that means you can provide a normal `mapStateToProps` function as well.

```js
import { connect } from "src/sdk/reducer";
// same as above
export default connect(["addPetRes", "someThingElseRes"])(App);
```

# FAQs

## Q - what kind of reducer is this in your `sdk/reducer` file ?

**A** - Hahaha, yes 5 lines of reducer to handle all those 200 api's, and no switch statements.
Splitting reducers in parts, writing switch statement, and type constants improves maintainablity of code and improves DX, but when it is managed by a auto generated code and no developer has to maintain it we can absolutely follow this structure. Also we are reducing thousands of lines of code.

## Q - Will a huge reducer won't affect performance of our app?

**A** - No. Every action dispatched is passed to every single reducer in Redux.

## Q - Should I use Redux-Thunk or Redux-Saga middleware ?

**A** - Your wish. This sdk does'not depend on any of them. You won't be having any aynchronous action to manage by yourself. If any, they will be very few and you can use Redux-Thunk for that.Because it does have zero API to learn and it is 300 bytes of code.
