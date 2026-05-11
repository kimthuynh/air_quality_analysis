/// <reference types="vite/client" />

declare module 'us-atlas/states-10m.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

// react-simple-maps v3 ships no .d.ts — declare the module to suppress TS7016
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode, SVGProps } from 'react';

  interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }
  export const ComposableMap: ComponentType<ComposableMapProps>;

  interface GeographiesProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geography: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: (props: { geographies: any[] }) => ReactNode;
  }
  export const Geographies: ComponentType<GeographiesProps>;

  interface GeographyProps extends SVGProps<SVGPathElement> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geography: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }
  export const Geography: ComponentType<GeographyProps>;
}
