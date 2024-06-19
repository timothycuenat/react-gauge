# React Gauge

A React component for displaying a gauge.

## Installation

```bash
npm install react-gauge
```

## Usage

```tsx
import React from 'react';
import Gauge from 'react-gauge';

export default function App() {
    return <Gauge
        min={0}
        max={100}
        value={75.18956}
        unit={'kW'}
        formatValue={(value) => value.toFixed(2)}
        animated
        settings={{
            container: {
                userSelect: 'none',
                display: 'flex',
                flex: 1,
                maxHeight: '7vw',
                maxWidth: '7vw',
                minHeight: '70px',
                minWidth: '70px',
                boxSizing: 'border-box',
            },
            text: {
                minAndMax: {
                    fill: 'rgba(255,255,255,0.75)',
                },
                unit: {
                    fill: 'rgba(255,255,255,0.5)',
                }
            },
            color: {
                gaugeBase: 'rgba(255,255,255,0.13)',
                gaugePercent: '#FF8000',
            }
        }}
    />
}
```

![Gauge](./assets/img.png)

