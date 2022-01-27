import Document, { Html, Head, Main, NextScript } from "next/document";

class NextDocument extends Document {
  render = () => (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/Azonix.otf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Product_Sans_Bold_Italic.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Product_Sans_Bold.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Product_Sans_Italic.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Product_Sans_Regular.ttf"
          as="font"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default NextDocument;
