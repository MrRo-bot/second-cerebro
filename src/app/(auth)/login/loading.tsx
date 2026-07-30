import CustomLoading from "@/components/CustomLoading";

const LoginLoading = () => {
  return (
    <div className="w-max h-max bg-zinc-200/20 px-3 py-1.5 rounded-lg">
      <CustomLoading className="scale-105" text="Login Loading..." />
    </div>
  );
};

export default LoginLoading;
