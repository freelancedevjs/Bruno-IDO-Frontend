import Heading from "@atoms/Heading";
import { useState } from "react";

const FaqSection = () => {
  const FaqList = [
    {
      question: "What is a launchpad?",
      answer:
        "A launchpad is a platform that boosts projects by allowing them to raise funds through the presale of their future token, known as an IDO. On the other hand, a launchpad allows private investors to enter in a very early stage that creates the possibility of achieving high returns.",
    },
    {
      question: "What makes Bipzy different from other launchpads?",
      answer:
        "Thanks to our expert team of crypto analysts, we can make an important filter of those projects that will be most promoted. Additionally, our extensive connection with influencers ensures that the projects receive significant exposure, greatly increasing their chances of success.",
    },
    {
      question: "What are the advantages Bipzy offers to investors?",
      answer:
        "On Bipzy's launchpad you can invest with the confidence that all the projects have been strictly reviewed and passed through a tough selection process.",
    },
    {
      question: "What average return do investors get?",
      answer:
        "Although we cannot guarantee any return per project, you can find the average return (since bipzy launch) updated every day on this page.",
    },
    {
      question: "What are the benefits of holding a KManus NFT?",
      answer:
        "Holding a KManus NFT allows you to have 24 h priority access to invest in the projects listed on the launchpad.",
    },
    {
      question: "What is the average investment raised per project?",
      answer:
        "Bipzy funding goals per project oscillates between $30,000 and $500,000 .",
    },
    {
      question: "Can anyone invest in the projects?",
      answer:
        "Anyone of legal age who knows the risks associated with investing in cryptocurrencies and their money does not come from any illegal activity.",
    },
    {
      question: "Can any project be listed on Bipzy?",
      answer:
        "No, only presales of projects that have been carefully selected by a team of experts are listed on Bipzy's launchpad.",
    },
  ];

  const QuestionAccordion = ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <div
          className="flex w-full justify-between cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}>
          <div className="text-white  w-full p-2 md:p-4 text-sm sm:text-xl bg-[#6100FF69]">
            {question}
          </div>
          <div className="bg-blue2 text-sm sm:text-xl p-2 md:py-4  md:px-6 cursor-pointer text-primary">
            <p>{isOpen ? "-" : "+"}</p>
          </div>
        </div>
        <div
          className={`p-4 text-white ${
            isOpen ? "h-full scale-100 mb-4" : "h-0 scale-0"
          }`}>
          <p className="text-sm sm:text-lg font-normal">{answer}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="faq-section py-20 md:py-24 px-6 sm:px-10 lg:px-20">
      <div className="mb-10 text-center">
        <p className="text-secondary xl:mr-20 capitalize text-2xl font-normal">
          Frequently Asked
        </p>
        <Heading text={"Questions?"} className="text-center" />
      </div>
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[1200px]">
          {FaqList.map((f, i) => (
            <QuestionAccordion {...f} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
