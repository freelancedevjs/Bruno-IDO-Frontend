import React from "react";
import Link from "next/link";
import { BsTwitter } from "react-icons/bs";
import useWidth from "@hooks/useWidth";
import { FaDiscord, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import Bipzylogo from "@public/icons/svgs/logo_footer.svg";
import Image from "next/image";
import { MdLock } from "react-icons/md";
import Lock from "@public/icons/lock.svg";

const FooterLinks = {
  company: [
    {
      title: "Terms of Service",
      link: "/terms-of-service",
    },
    {
      title: "Privacy Policy",
      link: "/privacy-policy",
    },
    {
      title: "Contact Us",
      link: "/contact",
    },
  ],
};

const SocialMediaItems = [
  {
    title: "Telegram",
    link: "https://t.me/bipzycom",
    icon: FaTelegramPlane,
  },
  {
    title: "Instagram",
    link: "https://www.instagram.com/bipzycom",
    icon: FaInstagram,
  },
  {
    title: "Twitter",
    link: "https://twitter.com/Bipzycom",
    icon: BsTwitter,
  },
  {
    title: "Discord",
    link: "https://discord.gg/MPfpMy2hQW",
    icon: FaDiscord,
  },
];

const SocialIcon = ({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: IconType;
}) => {
  const Icon = icon;
  return (
    <Link href={link} key={title}>
      <a target="_blank">
        <Icon
          className="hover:scale-125 transform transition duration-500 text-blue2"
          size={26}
        />
      </a>
    </Link>
  );
};

const Footer = ({ className }: { className?: string }) => {
  return (
    <div className=" bg-footer">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="w-full md:max-w-md">
            <Link href={"/"} className="cursor-pointer">
              <div className="flex items-start">
                <Image
                  src={Bipzylogo}
                  alt="Bipzy"
                  height={58}
                  width={230}
                  objectFit="contain"
                />
              </div>
            </Link>
            <p className="text-sm text-accent">
              {
                "Bipzy LaunchPad is a platform for the launch and funding of innovative blockchain projects. It connects project teams with investors, providing a space to showcase ideas, raise capital through token sales, and facilitate community engagement in the crypto space."
              }
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {FooterLinks.company.map((c, i) => (
              <Link key={i} href={`${c.link}`}>
                <p
                  key={i}
                  className="font-medium text-accent text-lg capitalize hover:underline cursor-pointer">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center sm:items-start lg:items-center">
            <div className="flex items-center justify-center gap-6 lg:gap-7">
              {SocialMediaItems.map((sm, i) => (
                <SocialIcon key={i} {...sm} />
              ))}
            </div>
            <div className="text-primary mt-7 flex justify-between items-center gap-4 max-w-[370px] bg-blue3 py-4 px-8 rounded-xl">
              <Image src={Lock} alt="lock" />
              <div className="text-center">
                <p className="text-base font-medium">TRUSTED AND SECURE</p>
                <p className="text-xs font-normal">ACCREDITED BUSINESS LLC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm py-6  text-accent text-center">
        Copyright Protected © by Bipzy LLC
      </p>
    </div>
  );
};

export default Footer;
