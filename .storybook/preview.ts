import React from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#DCEBF5' },
        dark: { name: 'dark', value: '#081120' },
      },
    },
  },

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      return React.createElement(
        'div',
        {
          className:
            theme === 'dark'
              ? 'dark text-foreground p-8 min-h-screen flex items-center justify-center relative'
              : 'text-foreground p-8 min-h-screen flex items-center justify-center relative',
          'data-theme': theme,
          style: {
            background:
              theme === 'dark'
                ? 'radial-gradient(circle at 15% 20%, rgba(0, 162, 255, 0.18) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(139, 92, 246, 0.18) 0%, transparent 40%), #040914'
                : 'radial-gradient(circle at 10% 15%, rgba(167, 218, 255, 0.6) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(216, 180, 254, 0.45) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(254, 205, 211, 0.35) 0%, transparent 50%), #DCEBF5',
          },
        },
        React.createElement(Story)
      );
    },
  ],

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
