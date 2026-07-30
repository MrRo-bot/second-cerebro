import CustomLoading from "@/components/CustomLoading";

const RegisterLoading = () => {
  return (
    <div className="w-max h-max bg-zinc-200/20 px-3 py-1.5 rounded-lg">
      <CustomLoading className="scale-105" text="Registration Loading..." />
    </div>
  );
};

export default RegisterLoading;
