import { useQuery } from '@tanstack/react-query';
import { Dispatch, createContext, useReducer } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../api/queryfn';
import { SERVER_URL } from '../api/url';
import { UserInfo } from '../types/userType';

export type State = {
  memberId: string;
  animalParents: boolean;
};

type Action =
  | { type: 'NOT_TOKEN'; memberId: string; animalParents: boolean }
  | { type: 'TOKEN'; memberId: string; animalParents: boolean };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'NOT_TOKEN': {
      return { memberId: action.memberId, animalParents: action.animalParents };
    }
    case 'TOKEN': {
      return { memberId: action.memberId, animalParents: action.animalParents };
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
  animalParents: false,
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
        animalParents: data.animalParents,
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
