import Heading from "@atoms/Heading";
import { FC, SetStateAction, useState } from "react";
import Image from "next/image";
import UserImage from "@public/images/userImage.png";
import Input2 from "@atoms/InputV2";
import TextArea from "@atoms/TextAreaV3";
import DropdownV2 from "@atoms/DropdownV2";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { useMutation } from "jsonapi-react";
import { isValidAddress } from "@walletconnect/utils";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";

interface ContactUsProps {}

const Initial_values = {
  first_name: "",
  last_name: "",
  email: "",
  telegram: "",
  wallet_address: "",
  department: "",
  description: "",
};

type IContactFormData = typeof Initial_values;

const ContactUs: FC<ContactUsProps> = ({}) => {
  const [mutate, { isLoading, data, error, errors }] = useMutation("contacts");

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .label("First Name")
      .required("First Name Required"),
    last_name: Yup.string().label("Last Name"),
    email: Yup.string().email("Invalid email").required("Email Required"),
    telegram: Yup.string()
      .url()
      .matches(
        /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/,
        "Invalid telegram url"
      ),
    wallet_address: Yup.string()
      .label("Wallet Address")
      .test(
        "isValidWalletAddress",
        "Invalid wallet address",
        (value) => !value || isValidAddress(value)
      ),
    department: Yup.string(),
    description: Yup.string(),
  });

  const submitForm = async (
    values: IContactFormData,
    actions: FormikHelpers<IContactFormData>
  ) => {
    try {
      await mutate(values);
      actions.resetForm();
      toast.success("Submitted successfully!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const formik = useFormik({
    initialValues: Initial_values,
    validationSchema: validationSchema,
    onSubmit: submitForm,
  });

  return (
    <div className="px-4 md:px-10 lg:px-20 pt-44 pb-10">
      <Heading
        className="text-center"
        textSize="text-3xl sm:text-4xl md:text-5xl"
        text="Talk with Bipzy Team. We’re here to Help."
      />
      <div className="flex flex-col md:flex-row md:flex-1 mt-16">
        <div className="md:flex-[0.40] p-6">
          <div>
            <Image src={UserImage} />

            <p className="font-medium text-primary text-2xl mt-10">
              Are you looking for more in-depth information about Bipzy?
            </p>

            <p className="text-sm text-gray14 mt-8">
              Bipzy is a Blockchain company that, since its foundation, has
              managed to build a team that has grown to over 50 employees spread
              across 9 cities worldwide.
              <br />
              <br />
              Our primary mission is to provide equal investment opportunities,
              regardless of your income level or geographical location.
              <br />
              <br />
              Let us know how can we help you today through our contact form.
            </p>
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="md:flex-[0.60] p-6 bg-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-10 w-full mb-10">
            <Input2
              name="first_name"
              label="First Name*:"
              onChange={formik.handleChange}
              value={formik.values.first_name}
              onBlur={formik.handleBlur}
              error={formik.touched.first_name && formik.errors.first_name}
            />
            <Input2
              name="last_name"
              label="Last Name:"
              onChange={formik.handleChange}
              value={formik.values.last_name}
              onBlur={formik.handleBlur}
              error={formik.touched.last_name && formik.errors.last_name}
            />
            <Input2
              name="email"
              label="Email* :"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
            <Input2
              name="telegram"
              label="Telegram:"
              onChange={formik.handleChange}
              value={formik.values.telegram}
              onBlur={formik.handleBlur}
              error={formik.touched.telegram && formik.errors.telegram}
            />
            <Input2
              name="wallet_address"
              label="Wallet Address:"
              onChange={formik.handleChange}
              value={formik.values.wallet_address}
              onBlur={formik.handleBlur}
              error={
                formik.touched.wallet_address && formik.errors.wallet_address
              }
            />
            <DropdownV2
              label="Support Department:"
              dropdownList={["Launchpad", "Algo Trading", "Buy USDT", "Other"]}
              selectedOption={formik.values.department}
              setSelectedOption={(v) => {
                formik.setFieldValue("department", v);
              }}
            />
          </div>
          <TextArea
            name="description"
            label="How can Bipzy Team Help you?"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
          />
          <div className="flex justify-center py-10">
            <button
              type="submit"
              className=" border border-primary rounded-full text-xl font-semibold text-primary w-full max-w-[368px] py-3 bg-dull-green ">
              {isLoading ? (
                <div className="animate-spin inline-flex h-full">
                  <AiOutlineLoading
                    className=" text-primary font-medium"
                    size={24}
                  />
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
