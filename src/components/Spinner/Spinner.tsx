import { SpinnerSize } from "@/enums/Common";
import { ClipLoader } from "react-spinners";

interface SpinnerProps {
  color?: string;
  size: string;
}

function Spinner({ color, size }: SpinnerProps) {
  return (
    <ClipLoader
      color={`${color}`}
      size={size === SpinnerSize.LARGE ? 44 : 24}
      speedMultiplier={0.7}
    />
  );
}

export default Spinner;
