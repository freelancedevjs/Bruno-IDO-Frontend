import { privacyPolicy } from "@constants/privacyPolicy";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="py-8 pt-36 px-10 md:px-20 text-white max-w-[1200px] mx-auto">
      <div className="font-normal">
        <p className="text-2xl mb-4 md:text-4xl font-semibold text-center">
          Bipzy LLC Privacy Policy
        </p>

        <p>
          Bipzy LLC, a Saint Vincent and the Grenadines limited liability
          company with Limited Liability Company Number 2666 LLC 2022, (“Bipzy”,
          “we”, “our” or “us”) collects information about you from various
          sources to provide the Services to you, to protect our legitimate
          interests, to analyze and improve our Services, to communicate with
          you, and to comply with our legal and regulatory obligations.
          <br />
          <br />
          This Privacy Policy outlines how we handle your personal Information
          when you use our website, https://www.bipzy.com, and the platform and
          services available on it. This Privacy Policy is an integral part of
          our Terms of Use, which governs your use of our Website. If you do not
          agree with this Privacy Policy or our Terms of Use, please refrain
          from using the Website. Please note that this policy may change over
          time, and your continued use of the Website after any modifications
          signifies your acceptance of such changes. We recommend reviewing the
          policy periodically for updates.
        </p>

        <br />
        <br />
        {privacyPolicy.map((pp, i) => {
          return (
            <div key={i}>
              <p className="text-xl font-semibold mb-3">{pp.title}</p>

              {typeof pp.subTitle === "string" ? (
                <p className="">{pp.subTitle}</p>
              ) : (
                <>
                  {Array.isArray(pp.subTitle) &&
                    pp.subTitle.every((item) => typeof item === "string") &&
                    pp.subTitle.map((st, i) => {
                      return (
                        <p key={i} className="mb-2">
                          {st}
                        </p>
                      );
                    })}
                </>
              )}
              <br />
              <>
                {pp.subArray &&
                  pp.subArray.map((st, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <span className="h-2 mt-2 flex-shrink-0 w-2 rounded-full bg-white"></span>
                      {st}
                    </div>
                  ))}
              </>
              <br />
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
