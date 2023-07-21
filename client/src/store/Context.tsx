import { useQuery } from '@tanstack/react-query';
import { Dispatch, createContext, useReducer } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../api/queryfn.ts';
import { SERVER_URL } from '../api/url.ts';
import { UserInfo } from '../types/userType.ts';

export type State = {
  memberId: string;
};

type Action =
  | { type: 'NOT_TOKEN'; memberId: string }
  | { type: 'TOKEN'; memberId: string };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'NOT_TOKEN': {
      return { memberId: action.memberId };
    }
    case 'TOKEN': {
      return { memberId: action.memberId };
    }
    default: {
      return state;
    }
  }
};

type Props = {
  children?: React.ReactNode;
};

export type ContextDispatch = Dispatch<Action>;
export const MemberIdContext = createContext<State | null>(null);
export const MemberIdDispatchContext = createContext<ContextDispatch | null>(
  null,
);
const initaldate: State = {
  memberId: '',
};

export default function ContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initaldate);
  const accessToken = useReadLocalStorage('accessToken');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery<UserInfo>({
    queryKey: ['contextApi', accessToken],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
    enabled: !!accessToken,
    onSuccess(data) {
      dispatch({
        type: 'TOKEN',
        memberId: `${data.memberInfo.memberId}`,
      });
    },
  });

  return (
    <MemberIdContext.Provider value={state}>
      <MemberIdDispatchContext.Provider value={dispatch}>
        {children}
      </MemberIdDispatchContext.Provider>
    </MemberIdContext.Provider>
  );
}
