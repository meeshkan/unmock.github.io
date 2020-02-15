---
id: react-native
title: Testing React Native Applications
sidebar_label: React Native
---

Unmock supports mocking API dependencies in React Native applications for tests running in Node.js. 

For a full example showing how to test asynchronous data loading with React hooks using [Jest](https://jestjs.io/) and [react-native-testing-library](https://github.com/callstack/react-native-testing-library), see [unmock-react-native-example](https://github.com/meeshkan/unmock-react-native-example) repository. Below we walk through the example.

## Tour of the example app

The [example application](https://github.com/meeshkan/unmock-react-native-example) shows a random cat fact fetched from the [Cat Facts API](https://alexwohlbruck.github.io/cat-facts/). User can refresh the fact by pressing the button. 

The app logic is contained in [App.tsx](https://github.com/meeshkan/unmock-react-native-example/blob/master/src/App.tsx). Data fetching and state management is managed with `useState` from React hooks:

```ts
const [shownFact, setFact] = useState('');
const [err, setError] = useState(null);
const [loading, setLoading] = useState(false);
```

Refreshing the shown fact at start-up or when user presses the button is made via `refreshFact` function:

```ts
const refreshFact = async () => {
    try {
        setLoading(true);
        const fact = await fetchFact();
        setFact(fact);
        setError(null);
    } catch (err) {
        setError(err);
    } finally {
        setLoading(false);
    }
};
```

Data fetching for the first rendering is triggered with `useEffect`:

```ts
useEffect(() => {
    refreshFact();
}, []);
```

Content is rendered based on the values of `loading` and `err`:

```jsx
{loading ? (
<Text style={styles.loading} testID="loading">
    Loading...
</Text>
) : err ? (
<Text style={{...styles.fact, ...styles.error}} testID="error">
    Something went horribly wrong, please try again!
</Text>
) : (
<Text style={styles.fact} testID="fact">
    {shownFact}
</Text>
)}
```

Note that we also give `testID` properties to components to simplify testing.

## Writing tests

### Prerequisites

Tests for the application are found in [App.test.tsx](https://github.com/meeshkan/unmock-react-native-example/blob/master/__tests__/App.test.tsx). 

The first step in the tests is to fill in `fetch` (not natively available in Node.js) with [node-fetch](https://www.npmjs.com/package/node-fetch):

```ts
// @ts-ignore
global.fetch = require('node-fetch');
```

In the `beforeAll` block, we switch on Unmock to intercept all outgoing traffic and define the API behaviour with `nock` syntax:

```ts
beforeAll(() => {
  unmock.on();
  unmock
    .nock('https://cat-fact.herokuapp.com', 'catFactApi')
    .get('/facts/random?animal_type=cat&amount=1')
    .reply(200, { text: u.string('lorem.sentence') })
    .reply(500, 'Internal server error');
});
```

Unmock state is resetted before each test so that the tests remain independent:

```ts
beforeEach(() => {
  unmock.reset();
});
```

### Test for success

The first test ensures that when the API successfully returns a cat fact, the fact block is displayed to the user:

```ts
it('renders the fact block when API succeeds', async () => {
    const api = unmock.services['catFactApi'];
    api.state(transform.withCodes(200));
    const renderApi: RenderAPI = render(<App />);

    await waitForElement(() => {
      return renderApi.getByTestId("fact");
    });
  });
```

First we set the API to always return 200, simulating success. We then use `render` from `react-native-testing-library` to fully render the component and run all hooks. We then use `waitForElement` from the same library to wait for the element with `testID="fact"` to show up.

Second test for success ensures that when user clicks the button, new fact is fetched from API. The button press is simulated with the `fireEvent` from `react-native-testing-library`: 

```ts
it('renders new fact after clicking the button', async () => {
    const api = unmock.services['catFactApi'];
    api.state(transform.withCodes(200));

    const renderApi: RenderAPI = render(<App />);

    fireEvent.press(renderApi.getByText('Get me a new one'));

    await waitForElement(() => {
      const secondCall = api.spy.secondCall;
      const secondFact = secondCall.returnValue.bodyAsJson;
      return renderApi.getByText(secondFact.text);
    });
  });
```

Here we again use `waitForElement`, but instead of relying on an element with `testID="fact"` to show up, we wait for an element that contains the same text as the (random) fact returned from the API.

### Test for failure

Test for failure proceeds similarly as the test for success: we change the API to return status code 500, render the app, and wait for the element with `testID="error"` to show up.

```ts
it('renders error when the API fails', async () => {
    const api = unmock.services['catFactApi'];
    api.state(transform.withCodes(500));

    const renderApi: RenderAPI = render(<App />);

    await waitForElement(() => {
        return renderApi.getByTestId('error');
    });
});
```