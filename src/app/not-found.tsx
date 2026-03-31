import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center my-2 font-heading">Not Found</h2>
      <p className="text-red-400 text-center">
        Could not find requested resource
      </p>
      <Link href="/" className="text-blue-400 text-center font-heading">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
