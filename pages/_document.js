import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Prevent iOS from forcing dark mode */}
        <meta name="color-scheme" content="light" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <style>{`
                    /* Override iOS dark mode */
                    * {
                        -webkit-user-select: auto;
                        -webkit-touch-callout: auto;
                    }
                    html {
                        color-scheme: light;
                        background: #ffffff;
                    }
                    body {
                        background: #ffffff;
                        color: #071124;
                    }
                `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
