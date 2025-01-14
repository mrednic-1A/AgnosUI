# Focus track

## Motivation

In a web application, there is often a requirement to determine whether an element or any of its descendants currently has focus, typically for accessibility purposes. Developers commonly devise their own methods to track this information. In AgnosUI, we provide a utility in core services that AgnosUI components leverage for this purpose.
Utilize the globally readable signal `activeElement$` to monitor the current focused item. If your focus is solely on your DOM element and its descendants, you have the option to generate a custom signal using the `HasFocus` factory.

## Service Overview

This service exports functionality related to managing focus within a web application. It includes a readable signal, `activeElement$`, representing the currently active HTML element, and a factory function, `createHasFocus()`, that creates an object implementing the `HasFocus` interface.

To install the core part, open your project's terminal and run the following command:

```bash
npm i @agnos-ui/core
```

### `activeElement$` Readable Signal

`activeElement$` is a readable signal that provides information about the currently focused HTML element.
When at least a consumer starts listening its value, it sets the active element to the current `document.activeElement`.
The active element is updated each time a `focusin`/ `focusout` event is triggered on the `document.documentElement`.
The event listeners are removed when the number of listeners fall to 0.

### `createHasFocus` Factory

`createHasFocus` is a factory function that creates an object conforming to the `HasFocus` interface.
It provides:

- `directive` that can be apply to elements to track if the focus is on one of the elements or on one of their descendent.
- `hasFocus$` signal (that internally uses the `activeElement$` signal) that say if the focus is actually among the elements (or their descendent) targeted by the directive.

## Usage

Whenever you want to check which element of the DOM has the focus, you can simply import the signal `activeElement$` and `subscribe` to it.

### In action

```sample
{Focustrack:focustrack/focustrack:500}
```

### Example Usage `activeElement$`

```typescript
import {activeElement$} from '@agnos-ui/core';}

const unsubscribe = activeElement$.subscribe((activeElement) => {
	console.log(`Tag name: ${activeElement?.tagName.toLowerCase()}, id: ${activeElement?.id}`);
})
```

### Example Usage `HasFocus`

If you are only interested to your element and descendent, then you have to use the `createHasFocus` factory, apply the directive to the element, and then subscribe to the `hasFocus$` signal.

```typescript
import {createHasFocus} from '@agnos-ui/core';

const {directive, hasFocus$} = createHasFocus();

// Apply the directive to specific elements
// (We provide utilities to apply this in the different framework context too)
var elementWhereToTrack = document.getElementById('id');
const instance = directive(elementWhereToTrack);

// Subscribe to the hasFocus$ signal
const unsubscribe = hasFocus$.subscribe((hasFocus) => {
	console.log(`Focused: ${hasFocus}`);
});

// Cleanup
unsubscribe();
instance?.destroy();
```

## Notes

- The code ensures proper cleanup by removing event listeners when no longer needed.
