import React from "react";
import { DefaultSeo as NextSeo } from "next-seo";

//internal import

import useAsync from "@hooks/useAsync";
import SettingServices from "@services/SettingServices";

const DefaultSeo = () => {
  const {
    data: globalSetting,
    loading,
    error,
  } = useAsync(SettingServices.getGlobalSetting);
  return (
    <NextSeo
      title={
        globalSetting?.meta_title ||
        "Home Smile - Home Decor Products"
      }
      openGraph={{
        type: "website",
        locale: "en_IE",
        url: globalSetting?.meta_url || "",
        site_name:
          globalSetting?.meta_title ||
          "Home Smile - Home Decor Products",
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          name: "viewport",
          content:
            "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ]}
      additionalLinkTags={[
        {
          rel: "apple-touch-icon",
          href: "https://homesmile.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1729058653%2Fundefined%2FAsset16.png&w=1920&q=75",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ]}
    />
  );
};

export default DefaultSeo;
