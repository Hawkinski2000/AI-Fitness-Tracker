declare module 'react-google-recaptcha' {
  import { Component } from 'react';

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    theme?: 'light' | 'dark';
    size?: 'normal' | 'compact' | 'invisible';
    [key: string]: unknown;
  }

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    getValue(): string | null;
    reset(): void;
  }
}
