import tw from 'tailwind-styled-components';

const Button = tw.button`
  w-9
  h-9
  bg-[lightgray]
`;

function App() {
  return <Button>안녕하세용</Button>;
}

export default App;
