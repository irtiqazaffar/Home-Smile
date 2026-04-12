import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import { FiMail, FiMapPin, FiBell } from "react-icons/fi";

//internal import
import Layout from "@layout/Layout";
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import { notifyError, notifySuccess } from "@utils/toast";
import InputArea from "@components/form/InputArea";
import PageHeader from "@components/header/PageHeader";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CustomerServices from "@services/CustomerServices";

const ContactUs = () => {
  const { t } = useTranslation();
  const [mailLoading, setMailLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, loading, error } = useGetSetting();

  const submitHandler = async (data) => {

    const supportData = {
      email: data.email,
      name: data.name,
      subject: data.subject,
      location: data.location,
      number: data.number,
      message: data.message
    }

    setMailLoading(true);
    try {
      const res = await CustomerServices.contactSupport(supportData)
      setValue("email", "");
      setValue("name", "");
      setValue("subject", "");
      setValue("location", "");
      setValue("number", "");
      setValue("message", "");
      notifySuccess(res.message);
      setMailLoading(false);
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setMailLoading(false);
    }
  };

  return (
    <Layout title="Contact Us" description="This is contact us page">
      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto lg:py-8 py-10 px-4 sm:px-10">

          {/* contact form */}
          <div className="px-0 mx-auto flex flex-col md:flex-row w-full justify-between">
            <div className="hidden md:w-full lg:w-5/12 lg:flex flex-col h-full">
              <Image
                width={874}
                height={874}
                src={
                  storeCustomizationSetting?.contact_us?.midLeft_col_img ||
                  "/contact-us.png"
                }
                alt="logo"
                className="block w-auto"
              />
            </div>
            <div className="px-0 pb-2 lg:w-6/12 flex flex-col md:flex-row">
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="w-full mx-auto flex flex-col justify-center"
              >
                <h1 className="text-3xl lg:text-4xl font-bold">Contact Us</h1>
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3">
                    <CMSkeleton
                      count={1}
                      height={50}
                      // error={error}
                      loading={loading}
                      data={storeCustomizationSetting?.contact_us?.form_title}
                    />
                  </h3>
                  <p className="text-base opacity-90 leading-7">
                    <CMSkeleton
                      count={2}
                      height={20}
                      // error={error}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.contact_us?.form_description
                      }
                    />
                  </p>
                </div>

                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                    <div className="w-full md:w-1/2">
                      <InputArea
                        register={register}
                        label={t("common:contact-page-form-input-name")}
                        name="name"
                        type="text"
                        placeholder={t(
                          "common:contact-page-form-plaholder-name"
                        )}
                      />
                      <Error errorName={errors.name} />
                    </div>
                    <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0">
                      <InputArea
                        register={register}
                        label={t("common:contact-page-form-input-email")}
                        name="email"
                        type="email"
                        placeholder={t(
                          "common:contact-page-form-plaholder-email"
                        )}
                      />
                      <Error errorName={errors.email} />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                    <div className="w-full md:w-1/2">
                      <InputArea
                        register={register}
                        label={"Number"}
                        name="number"
                        type="number"
                        placeholder={t(
                          "Enter Your Number"
                        )}
                      />
                      <Error errorName={errors.number} />
                    </div>
                    <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0">
                      <InputArea
                        register={register}
                        label={"Location"}
                        name="location"
                        type="text"
                        placeholder={t(
                          "Enter Your Location"
                        )}
                      />
                      <Error errorName={errors.location} />
                    </div>
                  </div>
                  <div className="relative">
                    <InputArea
                      register={register}
                      label={"Subject"}
                      name="subject"
                      type="text"
                      placeholder={t(
                        "Enter Subject"
                      )}
                    />
                    <Error errorName={errors.subject} />
                  </div>
                  <div className="relative mb-4">
                    <Label
                      label={t("common:contact-page-form-input-message")}
                    />
                    <textarea
                      {...register("message", {
                        required: `Message is required!`,
                      })}
                      name="message"
                      className="px-4 py-3 flex items-center w-full rounded appearance-none opacity-75 transition duration-300 ease-in-out text-sm focus:ring-0 bg-white border-2 border-gray-500 focus:shadow-none focus:outline-none focus:border-black placeholder-body"
                      autoComplete="off"
                      spellCheck="false"
                      rows="4"
                      placeholder={t(
                        "common:contact-page-form-plaholder-message"
                      )}
                    ></textarea>
                    <Error errorName={errors.message} />
                  </div>
                  <div className="relative">
                    {mailLoading ? (
                      <button
                        disabled={mailLoading}
                        type="submit"
                        className="w-56 text-center py-3 rounded bg-gray-700 text-white hover:bg-gray-800 transition-all focus:outline-none my-1 flex justify-center"
                      >
                        <img
                          src="/loader/spinner.gif"
                          alt="Loading"
                          width={20}
                          height={10}
                        />
                        <span className="font-serif ml-2 font-light">
                          Processing
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={mailLoading}
                        type="submit"
                        className="w-56 text-center text-lg py-3 rounded border-2 bg-gray-200 border-black text-black hover:bg-black hover:text-white transition-all focus:outline-none my-1"
                      >
                        {t("common:contact-page-form-send-btn")}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* contact promo */}
          <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3 xl:gap-8">
            {loading ? (
              <CMSkeleton
                count={10}
                height={20}
                error={error}
                loading={loading}
              />
            ) : (
              <div className="border bg-black p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-white mb-4">
                  <FiMail />
                </span>
                <h5 className="text-xl mb-2 text-white font-bold">
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us?.email_box_title
                  )}
                </h5>
                <p className="mb-0 text-base text-white opacity-90 leading-7">
                  <a
                    href={`mailto:${storeCustomizationSetting?.contact_us?.email_box_email}`}
                    target="_blank"
                    className="text-white"
                  >
                    {/* {showingTranslateValue(
                      storeCustomizationSetting?.contact_us?.email_box_email
                    )} */}
                    krishanurastogi06@gmail.com
                  </a>{" "}
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us?.email_box_text
                  )}
                </p>
              </div>
            )}

            {loading ? (
              <CMSkeleton
                count={10}
                height={20}
                error={error}
                loading={loading}
              />
            ) : (
              <div className="border bg-black p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-white mb-4">
                  <FiBell />
                </span>
                <h5 className="text-xl mb-2 text-white font-bold">
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us?.call_box_title
                  )}
                </h5>
                <p className="mb-0 text-base text-white opacity-90 leading-7">
                  <a
                    href={`tel:${storeCustomizationSetting?.contact_us?.call_box_phone}`}
                    className="text-white"
                  >
                    {/* {showingTranslateValue(
                      storeCustomizationSetting?.contact_us?.call_box_phone
                    )} */}
                    +91 8130065326
                  </a>{" "}
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us?.call_box_text
                  )}
                </p>
              </div>
            )}
            {loading ? (
              <CMSkeleton
                count={10}
                height={20}
                error={error}
                loading={loading}
              />
            ) : (
              <div className="border bg-black p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-white mb-4">
                  <FiMapPin />
                </span>
                <h5 className="text-xl mb-2 text-white font-bold">
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us?.address_box_title
                  )}
                </h5>
                <p className="mb-0 text-base text-white opacity-90 leading-7">
                  {/* <span>
                    {showingTranslateValue(
                      storeCustomizationSetting?.contact_us
                        ?.address_box_address_one
                    )}
                  </span>{" "}
                  <br />
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us
                      ?.address_box_address_two
                  )}{" "}
                  <br />
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us
                      ?.address_box_address_three
                  )} */}
                  123 Innovation Drive, Tech Park,
                  Sector 45, Gurgaon, Haryana - 122003
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
