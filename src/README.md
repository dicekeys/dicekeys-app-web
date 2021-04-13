# DiceKeys TypeScript App for DiceKeys.app (and future Electron app)

## Running
```
parcel src/index.html
```

## Run tests
```
jest
```

## Architecture

The app uses a reactive-style of UI coding in which code is divided into:
  - State objects, which represent the current state of the application, and
  - Views, which render mostly-stateless UI components to reflect the application state.

Global state is under the `state` directory and `views` are under the views directory.
State-objects that are local to one or more views may be stored adjacent to their view.

State is managed with MobX, and state classes contain actions (methods) that will modify state.

MobX-enhanced React components automatically re-render views as needed when state changes.
We inject state into these components through their React props (React's name for the parameters passed to a view by its parent).

We borrow from environments like SwiftUI, which allow you to run and inspect individual components by rendering previews, by manually
creating preview HTML files for key components that operate only on the subset of the application state that required for those views.

For example, to preview the ScanDiceKeyView, run
```
parcel src/Views/LoadingDiceKeys/ScanDiceKeyView.test.html
```


## Security notes

### Dependencies

Due to our strict security requirements, we try to minimize dependencies.  The only non-dev components we use are our own support libraries
  - our own `SeededCrypto` library, built on `LibSodium`
  - our DiceKey scanning library, built on `OpenCV`
  - `emscripten`, the WebAssembly compiler used to build the above two libraries and marshall data
  - `React`, the highly-popular UI library with a great security track record.
  - `MobX`, not quite as popular as React, but a small code base with a great security track record.
  - `parcel` generates code during the build process and relies on other dependencies.
  
Testing with `jest` introduces other dependencies, but those should not be compiled into the production applications.
