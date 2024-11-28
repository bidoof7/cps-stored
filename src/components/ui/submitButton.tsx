import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubmitButton = ({ loading }: { loading: boolean }) => {
  return (
    <Button className="w-full" disabled={loading}>
      {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
    </Button>
  );
};

export default SubmitButton;
