import SettingServices from "@services/SettingServices";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Fetch general metadata from backend API
    const setting = await SettingServices.getStoreSeoSetting();

    return { ...initialProps, setting };
  }

  render() {
    const setting = this.props.setting;
    return (
      <Html lang="en">
        <Head>
          {/* Meta Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s) {
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '567063692616954'); 
              fbq('track', 'PageView');
            `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=567063692616954&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    (function(w,d,s,l,i){
                      w[l]=w[l]||[];
                      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                      var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                      j.async=true;
                      j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                      f.parentNode.insertBefore(j, f);
                    })(window,document,'script','dataLayer','GTM-TDM9546F');
                  `,
            }}
          />
          {/* End Google Tag Manager */}
          <link rel="icon" type="image/png" href={setting?.seo?.favicon || "/favicon1.png"} />
          <link rel="icon" type="image/x-icon" href="/favicon1.png" />
          <meta
            property="og:title"
            content={
              setting?.seo?.meta_title ||
              "Home Smile - Home Decor Products"
            }
          />
          <meta property="og:type" content="eCommerce Website" />
          <meta
            property="og:description"
            content={
              setting?.seo?.meta_description ||
              "Decore your Home with Home Smile"
            }
          />
          <meta
            name="keywords"
            content={setting?.seo?.meta_keywords || "Home Decor Products, Home Smile"}
          />
          <meta
            property="og:url"
            content={
              setting?.seo?.meta_url || "https://homesmile.com"
            }
          />
          <meta
            property="og:image"
            content={
              setting?.seo?.meta_img ||
              ""
            }
          />
          <meta name="google-site-verification" content="M5HS0bNMAGEC7nlreZagCVYxdPJgCTMwG8Jaq22Pphc" />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TDM9546F"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
