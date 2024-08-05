import NewHome from "@components/NewHome";

const Home = (props: any) => {
  return (
    <div className=" text-2xl">
      <NewHome additionalProps={props} />
    </div>
  );
};

export default Home;
