export interface MutationProp {
  keys?: (string | number)[][];
  key?: string[];
  successFn?: () => void;
  errorFn: () => void;
}
