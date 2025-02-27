# pagepal-js
A mini js project to show onboarding tours to new users

## Usage
In index.html, add the following code:
```html
<script src="pagepal.js"></script>
```

in css, import the following css file:
```css
@import 'pagepal.scss';
```

In your js file, add the following code:
```js
const steps = [
  {
    tooltipContent: 'Review how many items are incomplete',
    element: $document[0].getElementById('dashboardStatsBlock'),
    scrollParent: $document[0].getElementById('dashboard-container'),
    defaultPosition: 'bottom',
    showSkip: false
  },
  {
    tooltipContent: 'Track the progress and totals in one place.',
    element: $document[0].getElementById('dashboardReportsStatsBlock'),
    scrollParent: $document[0].getElementById('dashboard-container'),
    defaultPosition: 'bottom',
    showSkip: false
  },
  {
    tooltipContent: 'Access your account tours anytime in the help & support menu.',
    element: $document[0].getElementById('supportMenuIcon'),
    defaultPosition: 'top',
    showSkip: false
  }
];

const config = {
  steps: steps,
  showBackdrop: true,
  // onFinish: <callback for on walkthrough finish if needed>,
  // onClose: <callback for on walkthrough close if needed>,
  // onSkip: <callback for on walkthrough skip if needed>,
  // onWalkthroughShown: <callback for on walkthrough shown if needed>,
  // onNext: <callback for next click if needed>
};

const pagepal = new PagePal(config);
pagepal.start();
```

