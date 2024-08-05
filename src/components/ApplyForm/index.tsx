import Loader from "@components/Loader";
import { useState } from "react";

function ApplyForm() {
  const [laodingForm, setlaodingForm] = useState(true);
  return (
    <div className="flex justify-center text-white pt-28 pb-20">
      <div className="w-full max-w-2xl p-4 bg-white rounded-xl">
        {laodingForm && <Loader />}
        <iframe
          src="https://tally.so/embed/mVj4Nv?alignLeft=1&dynamicHeight=1%22"
          onLoad={() => setlaodingForm(false)}
          loading="lazy"
          width="100%"
          height="1490"
          className=""
          title="Project Introduction"
        />
      </div>
    </div>
  );
}

export default ApplyForm;
