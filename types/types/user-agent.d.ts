declare module 'user-agent' {
  interface Device {
    toString: () => string;
  }

  interface OS {
    toString: () => string;
  }

  interface ParsedUserAgent {
    device: Device;
    family: string;
    os: OS;
  }

  function parse(userAgent: string): ParsedUserAgent;

  export = {
    parse,
  };
}
