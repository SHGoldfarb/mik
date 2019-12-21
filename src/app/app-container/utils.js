import { useHistoryParam } from "../utils";
import { REPLACE } from "../../utils/navigation";

const activeParam = "active";

export const useActiveMonthStr = () =>
  useHistoryParam(activeParam, {
    method: REPLACE
  });
