import { Flex, Input, Badge } from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import { AiTwotoneDelete } from 'react-icons/ai';
import { TbDragDrop } from 'react-icons/tb';

const FormQuestion = ({ q, delQues, controls }: any) => {
  return (
    <Flex
      alignItems='center'
      gap='3'
      w='full'
      as={Reorder.Item}
      value={q}
      id={q}
    >
      <TbDragDrop
        onPointerDown={(event) => controls.start(event)}
        size={q.isRequired ? '26' : '23'}
        cursor='grab'
      />
      <Input variant='filled' value={q.val} readOnly />
      {q.isRequired && (
        <Badge
          display='grid'
          placeItems='center'
          px='3'
          rounded='full'
          colorScheme='purple'
        >
          Required
        </Badge>
      )}
      <AiTwotoneDelete size={25} onClick={() => delQues(q)} cursor='pointer' />
    </Flex>
  );
};

export default FormQuestion;
