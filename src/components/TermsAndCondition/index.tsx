import { privacyPolicy } from "@constants/privacyPolicy";
import {
  Definitions,
  Disclaimer,
  RiskStatement,
  termsOfServices,
} from "@constants/termsAndServices";
import React from "react";

const TermsAndCondition = () => {
  return (
    <div className="py-8 pt-36 px-10 md:px-20 text-white max-w-[1200px] mx-auto">
      <div className="font-normal">
        <p className="text-2xl mb-6 md:text-4xl font-semibold text-center">
          Bipzy LLC Terms of Service Agreement
        </p>

        <p>
          These Terms of Service is a legal and binding contract between BIPZY
          LLC, a Saint Vincent and the Grenadines limited liability company with
          Limited Liability Company Number 2666 LLC 2022, its successors and
          assigns (hereinafter ”Bipzy“, “our”, “us” or “we”), and the party or
          parties (the ”User“, “you” or “your”) accessing and/or using the
          Services.
          <br />
          <br />
          By accessing this page, you acknowledge and agree to abide by the
          terms and conditions of Bipzy.
        </p>

        <br />
        <br />
        <br />

        <p className="text-xl mb-4 md:text-3xl font-semibold text-center">
          Disclaimer
        </p>
        {Disclaimer.map((dc, i) => (
          <div key={i} className="mb-3 flex">
            <span className="mr-2">{`${i + 1}. `}</span>
            <span>{dc}</span>
          </div>
        ))}
        <br />
        <br />
        <br />

        <p className="text-xl mb-4 md:text-3xl font-semibold text-center">
          Risk Statement
        </p>
        {RiskStatement.map((rs, i) => (
          <div key={i} className="mb-3 flex">
            <span className="mr-2">{`${i + 1}. `}</span>
            <span>{rs}</span>
          </div>
        ))}
        <br />
        <br />
        <br />

        <p className="text-xl mb-4 md:text-3xl font-semibold text-center">
          Definitions
        </p>
        {Definitions.map((df, i) => (
          <div key={i} className="mb-3 flex">
            <span>{`${String.fromCharCode(97 + i)})`}</span>
            <span className="ml-2">{df}</span>
          </div>
        ))}
        <br />
        <br />
        <br />

        <p className="text-xl mb-6 md:text-3xl font-semibold text-center">
          Terms and conditions
        </p>
        {termsOfServices.map((pp, i) => {
          return (
            <div key={i}>
              <p className="text-xl font-semibold mb-3">
                <span>{`${i + 1}. `}</span>
                {pp.title}
              </p>
              <>
                {pp.subTitle &&
                  pp.subTitle.map((st, i) => {
                    return (
                      <p key={i} className="mb-2">
                        {st}
                      </p>
                    );
                  })}
              </>
              <>
                {pp.pointers &&
                  pp.pointers.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <span className="h-2 mt-2 flex-shrink-0 w-2 rounded-full bg-white"></span>
                      {pt}
                    </div>
                  ))}
              </>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TermsAndCondition;
