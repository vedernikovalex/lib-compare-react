interface Props {
  text: string;
}

const SharedHello = ({ text }: Props) => {
  return (
    <>
      <p>{`Hello ${text}!`}</p>
    </>
  );
};

export default SharedHello;
